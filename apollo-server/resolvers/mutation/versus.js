const { db, Versus, Character } = require('../../connectors');
const Constants = require('../../constants');
const SQL = require('../../db-scripts');
const { VersusTypes } = require('../../constants/enums');

module.exports = {
  versusCreateDaily(_, __, context) {
    return db.transaction(async (transaction) => {
      return await Character.findAll({
        order: db.literal('RANDOM()'),
        limit: Constants.dailyVersusCharacterCount,
        transaction
      }).then((randomCharacters) =>
        context.Versus.createForCharacters(
          VersusTypes.Daily,
          randomCharacters,
          {
            transaction
          }
        )
      );
    });
  },
  versusVote(_, { versusId, winnerId }) {
    return Versus.update({ winnerId }, { where: { id: versusId } }).then(() =>
      Versus.findById(versusId)
    );
  },
  versusFromRules(_, args, context) {
    if (args.rules && args.rules.hasNoVersusOnly) {
      return db.transaction(async (transaction) => {
        return db
          .query(SQL['get_unblooded_characters'], {
            type: db.QueryTypes.SELECT,
            transaction
          })
          .then(async (randomCharacters) => {
            const characterCount = randomCharacters.length;
            const needAnotherCharacter = characterCount < 2;
            const notEnoughCharacters = characterCount === 0;
            let otherCharacter = [];

            if (notEnoughCharacters) {
              throw Error('Unable to create any character pairs.');
            }

            if (needAnotherCharacter) {
              otherCharacter = await Character.findAll({
                where: {
                  id: { [Op.nin]: randomCharacters.map((x) => x.id) }
                },
                order: db.literal('RANDOM()'),
                limit: 1,
                transaction
              });
            }

            return Versus.create(
              { type: VersusTypes.Single },
              {
                transaction
              }
            ).then(async (singleVersus) => {
              const characterIds = [...randomCharacters, ...otherCharacter]
                .slice(0, 2)
                .map((x) => x.id);

              await singleVersus.setCharacters(characterIds, { transaction });
              return singleVersus.reload({ transaction });
            });
          });
      });
    } else {
      return db.transaction(async (transaction) => {
        const randomCharacters = await context.Character.findFromRules(args, {
          order: db.literal('RANDOM()'),
          limit: 2,
          transaction
        });

        if (randomCharacters.length < 2) {
          throw Error('Unable to create any character pairs.');
        }

        return Versus.create(
          { type: VersusTypes.Single },
          {
            transaction
          }
        ).then(async (singleVersus) => {
          await singleVersus.setCharacters(randomCharacters, { transaction });
          return singleVersus.reload({ transaction });
        });
      });
    }
  }
};
