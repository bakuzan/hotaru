const Utils = require('../utils');

module.exports = {
  characters(versus) {
    return versus.getCharacters();
  },
  winner(versus) {
    return versus.getWinner();
  },
  updatedAt(versus) {
    return Utils.formatDateDisplay(versus.updatedAt);
  }
};
