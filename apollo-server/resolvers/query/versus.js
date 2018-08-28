const Op = require('sequelize').Op;

const { Versus, Character } = require('../../connectors');
const Constants = require('../../constants');
const Utils = require('../../utils');

module.exports = {
  activeDailyVersus() {
    const todayMidnight = new Date();
    d.setHours(0, 0, 0, 0);

    return Versus.findAll({
      where: {
        type: 'Daily',
        [Op.or]: [
          {
            createdAt: {
              [Op.gt]: todayMidnight
            }
          },
          {
            winnerId: {
              [Op.eq]: null
            }
          }
        ]
      }
    }).then((versusList) => {
      if (versusList.length) return versusList;

      return context.transaction(async (transaction) => {
        return Character.findAll(
          {
            order: 'random()',
            limit: Constants.dailyVersusCharacterCount
          },
          { transaction }
        ).then((randomCharacters) => {
          const rawVersus = Utils.chunk(randomCharacters, 2)
            .filter((x) => x.length === 2)
            .map((characters) => ({ type: 'Daily', characters }));

          if (!rawVersus.length) {
            throw Error('Unable to create any character pairs.');
          }

          return Versus.bulkCreate(rawVersus, {
            transaction,
            include: [Versus.Character]
          });
        });
      });
    });
  }
};