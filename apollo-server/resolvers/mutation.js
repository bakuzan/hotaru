const Op = require('sequelize').Op;

const { Character, Series } = require('../connectors');

module.exports = {
  characterCreate(_, { seriesId = null, ...args }) {
    return Character.create({
      ...args
    }).then((character) => {
      character.setSeries(seriesId);
      return character.reload({ includes: [{ model: Series }] });
    });
  },
  characterUpdate(_, { id, seriesId, ...args }) {
    return Character.update({ ...args }, { where: { id } }).then(() =>
      Character.findById(id).then((character) => {
        character.setSeries(seriesId);
        return character.reload({ includes: [{ model: Series }] });
      })
    );
  },
  seriesCreate(_, args) {
    return Series.create({ ...args }).then((series) => series);
  },
  seriesUpdate(_, { id, ...args }) {
    return Series.update({ ...args }, { where: { id } }).then(() =>
      Series.findById(id)
    );
  }
};
