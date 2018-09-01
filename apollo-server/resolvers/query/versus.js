const Op = require('sequelize').Op;

const { Versus } = require('../../connectors');

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
  versusCharacterHistory(_, { characterIds }) {
    console.log('character history not implemented', characterIds);
  }
};
