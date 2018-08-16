const Op = require('sequelize').Op;

const { Character, Series } = require('../connectors');

module.exports = {
  characterCreate(_, { seriesId, ...args }) {
    return Character.create({
      ...args,
      Series: {
        id: seriesId
      }
    }).then((character) => character);
  },
  characterUpdate(_, { id, seriesId, ...args }) {
    return Character.update({ ...args }, { where: { id } }).then(() =>
      Project.findById(id)
    );
  },
  seriesCreate(_, { technologies, ...args }) {
    return Series.create({ ...args }).then((series) => series);
  },
  seriesUpdate(_, { id, technologies, ...args }) {
    return Series.update({ ...args }, { where: { id } }).then(() =>
      Series.findById(id)
    );
  }
};
