const { db, HTRTemplate, HTRInstance } = require('../../connectors');

const Enums = require('../../constants/enums');

module.exports = {
  htrInstanceCreate(_, { instance }) {
    return db.transaction((transaction) =>
      HTRTemplate.findById(instance.htrTemplateId, { transaction }).then(
        (template) => {
          const { characterIds, versus, ...data } = instance;

          return HTRInstance.create(
            { ...data, settings: { ...data.settings, rules: template.rules } },
            { transaction }
          )
            .then(async (newInstance) => {
              if (template.type === Enums.HTRTemplateTypes.List) {
                return await newInstance
                  .setCharacters(characterIds, { transaction })
                  .then(() => newInstance);
              } else {
                /* TODO
               * handle Braket type
               *    (1) query for characters
               *    (2) refactor existing versus creation from character list (cotnext)
               *    (3) setVersus
               *    (4) update instance with versus matches (save into settings) & status BracketStatuses.notstarted
               */
                return newInstance;
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
                if (template.type === Enums.HTRTemplateTypes.List) {
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
  htrInstanceVersusVote(_, args) {
    console.log('versus vote for bracket not implemented', args);
  }
};
