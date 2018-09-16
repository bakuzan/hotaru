const Op = require('sequelize').Op;

const { Versus } = require('../connectors');
const BracketSizes = require('../constants/enums').BracketSizes;
const Utils = require('../utils');

async function createForCharacters(versusType, characters, options = {}) {
  const { transaction, bracketLimit } = options;
  const createdAt = Date.now() - 1000;

  let versusCharacters = Utils.chunk(characters, 2).filter(
    (x) => x.length === 2
  );

  const versusCount = versusCharacters.length;
  if (!versusCount) {
    throw Error('Unable to create any character pairs.');
  }

  const characterCount = versusCount * 2;
  if (bracketLimit && characterCount !== bracketLimit) {
    const newCharacterLimit = BracketSizes.find((x) => x <= characterCount);
    if (!newCharacterLimit)
      throw Error('Too few characters to create a bracket.');

    const newVersusLimit = newCharacterLimit / 2;
    versusCharacters = versusCharacters.slice(0, newVersusLimit);
  }

  const versusShells = versusCharacters.map(() => ({ type: versusType }));
  return await Versus.bulkCreate(versusShells, {
    transaction
  }).then(async () => {
    const promises = [];
    const createdVersus = await Versus.findAll({
      where: { createdAt: { [Op.gte]: createdAt } },
      transaction
    });

    createdVersus.forEach((v, i) => {
      const pairing = versusCharacters[i];
      promises.push(v.setCharacters(pairing, { transaction }));
    });

    return Promise.all(promises).then(() => {
      const versusIds = createdVersus.map((x) => x.id);
      return Versus.findAll({
        where: { id: { [Op.in]: versusIds } },
        transaction
      });
    });
  });
}

module.exports = {
  createForCharacters
};
