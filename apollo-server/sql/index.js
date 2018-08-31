const fs = require('fs');

const populateRankings = fs.readFileSync('populate_rankings.sql').toString();

module.exports = {
  populateRankings
};
