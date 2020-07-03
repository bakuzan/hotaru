const Utils = require('../utils');

module.exports = {
  score(ranking) {
    return Utils.roundFloat(ranking.rankOrder, 3);
  },
  wins(ranking) {
    return ranking.wins || 0;
  }
};
