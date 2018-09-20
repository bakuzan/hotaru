const Op = require('sequelize').Op;

const { Versus } = require('../connectors');
const Utils = require('../utils');
const bracktCorrector = require('../utils/bracket-corrector');

async function createForCharacters(versusType, characters, options = {}) {
  const { transaction, bracketLimit } = options;
  const createdAt = Date.now() - 1000;

  const versusCharacters = Utils.chunk(
    bracktCorrector(characters, bracketLimit),
    2
  ).filter((x) => x.length === 2);

  const versusCount = versusCharacters.length;
  if (!versusCount) {
    throw Error('Unable to create any character pairs.');
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
