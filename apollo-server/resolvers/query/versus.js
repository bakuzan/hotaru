const Op = require('sequelize').Op;

const { db: context, Versus } = require('../../connectors');
const SQL = require('../../db-scripts');

module.exports = {
  versusDailyActive() {
    const todayMidnight = new Date();
    todayMidnight.setUTCHours(0, 0, 0, 0);

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
      },
      order: [['createdAt', 'DESC']]
    });
  },
  versusHistoryComparison(_, { characterIds }) {
    const [c1, c2] = characterIds;
    return context.query(SQL['get_versus_history_for_characters'], {
      replacements: { c1, c2 }
    });
  }
};
