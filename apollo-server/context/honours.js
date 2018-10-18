const { db } = require('../connectors');
const SQL = require('../db-scripts');

async function mostWinsForDate(daysAgo) {
  return await db.query(SQL['get_most_wins_in_last_X'], {
    type: db.QueryTypes.SELECT,
    replacements: { daysAgo }
  });
}

module.exports = {
  mostWinsForDate
};
