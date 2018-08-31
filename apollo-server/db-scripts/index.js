const path = require('path');
const fs = require('fs');

const populateRankings = fs
  .readFileSync(path.join(__dirname, 'populate_rankings.sql'))
  .toString();

module.exports = {
  populateRankings
};
