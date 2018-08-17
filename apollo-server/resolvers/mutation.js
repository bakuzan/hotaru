const Op = require('sequelize').Op;

const { Character, Series } = require('../connectors');

module.exports = {
  characterCreate(_, { character }) {
    const { seriesId = null, ...args } = character;

    return Character.create({
      ...args
    }).then((character) => {
      character.setSeries(seriesId);
      return character.reload({ includes: [{ model: Series }] });
    });
  },
  characterUpdate(_, { character }) {
    const { id, seriesId, ...args } = character;

    return Character.update({ ...args }, { where: { id } }).then(() =>
      Character.findById(id).then((character) => {
        character.setSeries(seriesId);
        return character.reload({ includes: [{ model: Series }] });
      })
    );
  },
  seriesCreate(_, { series }) {
    return Series.create({ ...series }).then((series) => series);
  },
  seriesUpdate(_, { series }) {
    const { id, ...args } = series;
    return Series.update({ ...args }, { where: { id } }).then(() =>
      Series.findById(id)
    );
  }
};
