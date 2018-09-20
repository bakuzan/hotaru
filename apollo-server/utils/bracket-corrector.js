const { BracketSizes } = require('../constants/enums');

module.exports = function bracketCorrector(characters, bracketLimit) {
  const characterCount = characters.length;
  if (!bracketLimit || characterCount === bracketLimit) return characters;

  const newCharacterLimit = BracketSizes.find((x) => x <= characterCount);
  if (!newCharacterLimit)
    throw Error('Too few characters to create a bracket.');

  return characters.slice(0, newCharacterLimit);
};
