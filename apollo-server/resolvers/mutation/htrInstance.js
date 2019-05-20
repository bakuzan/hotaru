const {
  db,
  HTRTemplate,
  HTRInstance,
  Versus,
  Character
} = require('../../connectors');

const {
  HTRTemplateTypes,
  VersusTypes,
  BracketStatuses,
  Orders
} = require('../../constants/enums');
const createSeeding = require('../../utils/createSeeding');

function typeProtection(instance) {
  const invalidType = ![
    HTRTemplateTypes.bracket,
    HTRTemplateTypes.list
  ].includes(instance.type);

  if (invalidType) {
    throw Error('Invalid HTR Instance type.');
  }
}

module.exports = {
  async htrInstanceCreate(_, { instance }, context) {
    typeProtection(instance);

    return await db
      .transaction(async (transaction) => {
        const template = await HTRTemplate.findByPk(instance.htrTemplateId, {
          transaction
        });

        const { characterIds, versus, ...data } = instance;
        const newInstance = await HTRInstance.create(
          {
            ...data,
            settings: {
              ...data.settings,
              rules: template.rules,
              customOrder:
                data.settings.order === Orders.Custom
                  ? data.settings.customOrder
                  : null
            }
          },
          { transaction }
        );

        if (template.type === HTRTemplateTypes.List) {
          return await newInstance
            .setCharacters(characterIds, { transaction })
            .then(() => newInstance);
        }

        const isSeeded = template.rules.isSeeded;
        const bracketLimit = data.settings.limit;
        const queryCharacters = await context.Character.findFromRules(
          {
            rules: template.rules
          },
          {
            transaction,
            limit: bracketLimit,
            order: db.literal('RANDOM()')
          }
        );

        const preppedData = await Promise.resolve().then(async () => {
          if (isSeeded) {
            return await createSeeding(context, queryCharacters, {
              transaction,
              bracketLimit
            });
          }

          return await Promise.resolve({ characters: queryCharacters });
        });

        const firstRoundVersus = await context.Versus.createForCharacters(
          VersusTypes.Bracket,
          preppedData.characters,
          {
            transaction,
            bracketLimit
          }
        );

        const firstRoundIds = firstRoundVersus.map((x) => x.id);
        await newInstance.setVersus(firstRoundIds, { transaction });

        await HTRInstance.update(
          {
            settings: {
              ...newInstance.settings,
              layout: [firstRoundIds],
              seedOrder: preppedData.seedOrder,
              status: BracketStatuses.NotStarted
            }
          },
          { where: { id: newInstance.id }, transaction }
        );

        console.log('COMMITTED', newInstance.id);
        return newInstance.id;
      })
      .then(async (newInstanceId) => {
        console.log('reloaded', newInstanceId);
        return await HTRInstance.findByPk(newInstanceId, {
          include: [
            {
              model: Versus,
              include: [{ model: Character }]
            }
          ]
        });
      });
  },
  htrInstanceUpdate(_, { instance }) {
    typeProtection(instance);

    return db.transaction((transaction) =>
      HTRTemplate.findByPk(instance.htrTemplateId, { transaction }).then(
        (template) => {
          const { id, characterIds, versus, ...data } = instance;

          return HTRInstance.update(
            {
              ...data,
              settings: {
                ...data.settings,
                customOrder:
                  data.settings.order === Orders.Custom
                    ? data.settings.customOrder
                    : null
              }
            },
            { where: { id }, transaction }
          ).then(() =>
            HTRInstance.findByPk(id, { transaction }).then(
              async (updatedInstance) => {
                if (template.type === HTRTemplateTypes.List) {
                  return await updatedInstance
                    .setCharacters(characterIds, {
                      transaction
                    })
                    .then(() => updatedInstance);
                }

                return updatedInstance;
              }
            )
          );
        }
      )
    );
  },
  htrInstanceVersusVote(_, { htrInstanceId, versusId, winnerId }, context) {
    return db.transaction((transaction) => {
      return Versus.update(
        { winnerId },
        { where: { id: versusId }, transaction }
      )
        .then(() =>
          HTRInstance.findByPk(htrInstanceId, {
            transaction,
            include: [{ model: Versus, include: [Character] }]
          })
        )
        .then((instance) => {
          let instanceUpdate;
          const { settings } = instance;
          const [currentRound] = settings.layout.slice(-1);

          if (currentRound.length === 1) {
            instanceUpdate = {
              ...settings,
              winnerId,
              status: BracketStatuses.Complete
            };

            return instanceUpdate;
          }

          instanceUpdate = {
            ...settings,
            winnerId: null,
            status: BracketStatuses.InProgress
          };

          const roundComplete = currentRound.every((vId) =>
            instance.versus.some((v) => v.id === vId && v.winnerId)
          );

          if (!roundComplete) return instanceUpdate;

          const advancingCharacters = currentRound
            .map((vId) => instance.versus.find((v) => v.id === vId))
            .map((v) => v.characters.find((c) => c.id === v.winnerId));

          return context.Versus.createForCharacters(
            VersusTypes.Bracket,
            advancingCharacters,
            {
              transaction
            }
          )
            .then((roundVersus) => {
              const roundVersusIds = roundVersus.map((x) => x.id);
              instanceUpdate = {
                ...instanceUpdate,
                layout: [...settings.layout, roundVersusIds]
              };
              return instance.addVersus(roundVersusIds, { transaction });
            })
            .then(() => instanceUpdate);
        })
        .then((settings) =>
          HTRInstance.update(
            { settings },
            { where: { id: htrInstanceId }, transaction }
          )
        )
        .then(() =>
          HTRInstance.findByPk(htrInstanceId, {
            transaction,
            include: [
              {
                model: Versus,
                include: [Character]
              }
            ]
          })
        );
    });
  }
};
