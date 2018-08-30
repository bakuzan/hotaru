const Utils = require('../utils');

module.exports = {
  ratio(versus) {
    const ratio = versus.wins / versus.total;
    return Utils.roundFloat(ratio, 2);
  },
  score(versus) {
    const score = (versus.wins / versus.total) * versus.wins;
    return Utils.roundFloat(score, 2);
  }
};
