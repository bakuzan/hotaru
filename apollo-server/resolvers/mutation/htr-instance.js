const {
  db,
  HTRTemplate,
  HTRInstance,
  Versus,
  Character,
  Ranking
} = require('../../connectors');

const {
  HTRTemplateTypes,
  VersusTypes,
  BracketStatuses,
  Orders
} = require('../../constants/enums');
const createSeeding = require('../../utils/seeder');

module.exports = {
  htrInstanceCreate(_, { instance }, context) {
    return db.transaction((transaction) =>
      HTRTemplate.findById(instance.htrTemplateId, { transaction }).then(
        (template) => {
          const { characterIds, versus, ...data } = instance;

          return HTRInstance.create(
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
          )
            .then(async (newInstance) => {
              if (template.type === HTRTemplateTypes.List) {
                return await newInstance
                  .setCharacters(characterIds, { transaction })
                  .then(() => newInstance);
              } else {
                const isSeeded = template.rules.isSeeded;
                return await context.Character.findFromRules(
                  {
                    rules: template.rules
                  },
                  {
                    transaction,
                    limit: data.settings.limit,
                    order: db.literal('RANDOM()'),
                    include: isSeeded ? [Ranking] : null
                  }
                ).then((queryCharacters) => {
                  const preppedData = isSeeded
                    ? createSeeding(queryCharacters, data.settings.limit)
                    : { characters: queryCharacters };

                  return context.Versus.createForCharacters(
                    VersusTypes.Bracket,
                    preppedData.characters,
                    {
                      transaction,
                      bracketLimit: data.settings.limit
                    }
                  ).then((firstRoundVersus) => {
                    const firstRoundIds = firstRoundVersus.map((x) => x.id);
                    return newInstance
                      .setVersus(firstRoundIds, { transaction })
                      .then(() =>
                        HTRInstance.update(
                          {
                            settings: {
                              ...newInstance.settings,
                              layout: [firstRoundIds],
                              seedOrder: preppedData.seedOrder,
                              status: BracketStatuses.NotStarted
                            }
                          },
                          { where: { id: newInstance.id }, transaction }
                        )
                      )
                      .then(() => newInstance);
                  });
                });
              }
            })
            .then((newInstance) => {
              const includes = template.rules.isSeeded ? [Ranking] : [];

              return newInstance.reload({
                transaction,
                include: [
                  {
                    model: Versus,
                    include: [{ model: Character, include: [...includes] }]
                  }
                ]
              });
            });
        }
      )
    );
  },
  htrInstanceUpdate(_, { instance }) {
    return db.transaction((transaction) =>
      HTRTemplate.findById(instance.htrTemplateId, { transaction }).then(
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
            HTRInstance.findById(id, { transaction }).then(
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
          HTRInstance.findById(htrInstanceId, {
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
          HTRInstance.findById(htrInstanceId, {
            transaction,
            include: [
              {
                model: Versus,
                include: [{ model: Character, include: [Ranking] }]
              }
            ]
          })
        );
    });
  }
};
