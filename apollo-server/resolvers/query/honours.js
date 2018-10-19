const { db } = require('../../connectors');
const SQL = require('../../db-scripts');

const Utils = require('../../utils');

const Keys = {
  mostWinsInLast7Days: 1,
  mostWinsInLast30Days: 2
};

module.exports = {
  async honours() {
    const weekAgo = Utils.getDaysAgoX(7);
    const monthAgo = Utils.getDaysAgoX(30);

    const [mostWinsInLast7Days, mostWinsInLast30Days] = await db.query(
      SQL['get_most_wins_for_days'],
      {
        type: db.QueryTypes.SELECT,
        replacements: { daysAgo1: weekAgo, daysAgo2: monthAgo }
      }
    );

    return {
      mostWinsInLast7Days: {
        ...mostWinsInLast7Days,
        key: Keys.mostWinsInLast7Days
      },
      mostWinsInLast30Days: {
        ...mostWinsInLast30Days,
        key: Keys.mostWinsInLast30Days
      }
    };
  }
};
