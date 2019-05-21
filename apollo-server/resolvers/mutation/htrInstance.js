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
const htrInstanceCreateHandler = require('./htrInstanceCreate');

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
      .transaction({
        autocommit: false,
        type: 'IMMEDIATE',
        retry: { max: 0 }
      })
      .then(
        async (transaction) =>
          await htrInstanceCreateHandler(instance, context, transaction)
      );
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
