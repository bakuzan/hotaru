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
                await newInstance.setCharacters(characterIds, { transaction });
              } else {
                /* TODO
               * handle Braket type
               *    (1) query for characters
               *    (2) refactor existing versus creation from character list (cotnext)
               *    (3) setVersus
               *    (4) update instance with versus matches (save into settings) & status BracketStatuses.notstarted
               */
              }

              return newInstance;
            })
            .then((newInstance) => newInstance.reload({ transaction }));
        }
      )
    );
  },
  htrInstanceUpdate(_, { instance }) {}
};
