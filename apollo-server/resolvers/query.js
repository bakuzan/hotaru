const Op = require('sequelize').Op;

const { Character, Series, Tag } = require('../connectors');

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
  characterImages(_, { characterId, ...args }) {
    return Character.findById(characterId).then((character) =>
      character.getImages({ where: args })
    );
  },
  series(_, { search = '', ...args }) {
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
  },
  tags(_, { search = '', ...args }) {
    return Tag.findAll({
      where: {
        ...args,
        name: {
          [Op.like]: `%${search}%`
        }
      },
      order: [['name', 'ASC']]
    });
  }
};
