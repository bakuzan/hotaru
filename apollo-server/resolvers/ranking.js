const Utils = require('../utils');

module.exports = {
  ratio(ranking) {
    const ratio = ranking.wins / ranking.total;
    return Utils.roundFloat(ratio, 2);
  },
  score(ranking) {
    const score = (ranking.wins / ranking.total) * ranking.wins;
    return Utils.roundFloat(score, 2);
  },
  character(ranking) {
    return ranking.getCharacter();
  }
};
