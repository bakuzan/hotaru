const Op = require('sequelize').Op;

const { Character, Series } = require('../connectors');

module.exports = {
  characters(_, { search = '', ...args }) {
    return Character.findAll({
      where: {
        ...args,
        name: {
          [Op.like]: `%${search}%`
        }
      },
      order: [['name', 'ASC']]
    });
  },
  characterById(_, args) {
    const { id } = args;
    return Character.findById(id);
  },
  series(_, { search, ...args }) {
    return Series.findAll({
      where: {
        ...args,
        name: {
          [Op.like]: `%${search}%`
        }
      },
      order: [['name', 'ASC']]
    });
  },
  seriesById(_, args) {
    const { id } = args;
    return Series.findById(id);
  }
};
