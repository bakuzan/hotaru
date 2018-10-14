const Utils = require('../utils');

module.exports = {
  characters(versus) {
    if (versus.characters) return versus.characters;

    return versus.getCharacters();
  },
  winner(versus) {
    if (versus.winner) return versus.winner;

    return versus.getWinner();
  },
  updatedAt(versus) {
    return Utils.formatDateDisplay(versus.updatedAt);
  }
};
