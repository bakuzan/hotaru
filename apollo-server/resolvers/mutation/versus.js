const { db, Versus, Character } = require('../../connectors');
const Constants = require('../../constants');
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
};
