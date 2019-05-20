const Op = require('sequelize').Op;

const { Versus } = require('../connectors');
const Utils = require('../utils');
const bracktCorrector = require('../utils/bracketCorrector');

async function createForCharacters(versusType, characters, options = {}) {
  const { transaction, bracketLimit } = options;
  const createdAt = Date.now() - 1000;

  const bc = bracktCorrector(characters, bracketLimit);
  const versusCharacters = Utils.chunk(bc, 2).filter((x) => x.length === 2);

  const versusCount = versusCharacters.length;
  if (!versusCount) {
    throw Error('Unable to create any character pairs.');
  }

  const versusShells = versusCharacters.map(() => ({ type: versusType }));
  await Versus.bulkCreate(versusShells, {
    transaction
  });

  const createdVersus = await Versus.findAll({
    where: { createdAt: { [Op.gte]: createdAt } },
    transaction
  });

  await Promise.all(
    createdVersus.map((v, i) => {
      const pairing = versusCharacters[i];
      return v.setCharacters(pairing, { transaction });
    })
  );

  const versusIds = createdVersus.map((x) => x.id);
  return await Versus.findAll({
    where: { id: { [Op.in]: versusIds } },
    transaction
  });
}

module.exports = {
  createForCharacters
};
