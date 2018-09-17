const { db, HTRTemplate, HTRInstance, Versus } = require('../../connectors');

const {
  HTRTemplateTypes,
  VersusTypes,
  BracketStatuses
} = require('../../constants/enums');

module.exports = {
  htrInstanceCreate(_, { instance }, context) {
    return db.transaction((transaction) =>
      HTRTemplate.findById(instance.htrTemplateId, { transaction }).then(
        (template) => {
          const { characterIds, versus, ...data } = instance;

          return HTRInstance.create(
            { ...data, settings: { ...data.settings, rules: template.rules } },
            { transaction }
          )
            .then(async (newInstance) => {
              if (template.type === HTRTemplateTypes.List) {
                return await newInstance
                  .setCharacters(characterIds, { transaction })
                  .then(() => newInstance);
              } else {
                return await context.Character.findFromRules(
                  {
                    rules: template.rules
                  },
                  { transaction, limit: data.settings.limit }
                )
                  .then((queryCharacters) =>
                    context.Versus.createForCharacters(
                      VersusTypes.Bracket,
                      queryCharacters,
                      {
                        transaction,
                        bracketLimit: data.settings.limit
                      }
                    )
                  )
                  .then((firstRoundVersus) => {
                    const firstRoundIds = firstRoundVersus.map((x) => x.id);
                    return newInstance
                      .setVersus(firstRoundIds, { transaction })
                      .then(() =>
                        HTRInstance.update(
                          {
                            settings: {
                              ...newInstance.settings,
                              layout: [firstRoundIds],
                              status: BracketStatuses.NotStarted
                            }
                          },
                          { where: { id: newInstance.id }, transaction }
                        )
                      )
                      .then(() => newInstance);
                  });
              }
            })
            .then((newInstance) => newInstance.reload({ transaction }));
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
            { ...data, settings: { ...data.settings } },
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
  htrInstanceVersusVote(_, { htrInstanceId, versusId, winnerId }) {
    console.log(
      'versus vote for bracket not implemented',
      htrInstanceId,
      versusId,
      winnerId
    );
    return db.transaction((transaction) => {
      return Versus.update(
        { winnerId },
        { where: { id: versusId }, transaction }
      );
    });
  }
};
