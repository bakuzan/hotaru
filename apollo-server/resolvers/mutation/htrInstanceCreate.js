const waterfall = require('async/waterfall');
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

module.exports = async function htrInstanceCreateHandler(
  instance,
  context,
  transaction,
  callback
) {
  const { characterIds, versus, ...data } = instance;

  await waterfall(
    [
      async function() {
        console.log('GET');
        return await HTRTemplate.findByPk(instance.htrTemplateId, {
          transaction
        });
      },
      async function(template) {
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
        console.log('CREATE');
        return { template, newInstance };
      },
      async function({ template, newInstance }) {
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

          return await Promise.resolve({
            characters: queryCharacters
          });
        });
        console.log('PREPPED');
        const firstRoundVersus = await context.Versus.createForCharacters(
          VersusTypes.Bracket,
          preppedData.characters,
          {
            transaction,
            bracketLimit
          }
        );

        const newInstanceId = newInstance.id;
        const firstRoundIds = firstRoundVersus.map((x) => x.id);
        await newInstance.setVersus(firstRoundIds, { transaction });

        return await HTRInstance.update(
          {
            settings: {
              ...newInstance.settings,
              layout: [firstRoundIds],
              seedOrder: preppedData.seedOrder,
              status: BracketStatuses.NotStarted
            }
          },
          { where: { id: newInstanceId }, transaction }
        ).then(async () => {
          console.log('UPDATED, PRE RELOAD', newInstanceId);
          return await newInstance.reload({
            transaction,
            include: [
              {
                model: Versus,
                include: [{ model: Character }]
              }
            ]
          });
        });
      }
    ],
    async function(err, newInstance) {
      if (err) {
        console.error('HTR Instance Rolled Back. ', err);
        return await transaction.rollback().then(() => callback(null));
      }

      console.log('RELOADED');
      return await transaction
        .commit()
        .then(() => callback(newInstance))
        .catch(async (err) => {
          console.log('FAILED', err.message);
          return await transaction.rollback().then(() => callback(null));
        });
    }
  );
};
