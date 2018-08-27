const Op = require('sequelize').Op;

const { Character, Series, Tag } = require('../connectors');

module.exports = {
  characters(_, { search = '', genders }) {
    const resolvedArgs = genders
      ? {
          gender: {
            [Op.in]: genders
          }
        }
      : {};

    return Character.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        ...resolvedArgs
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
  series(_, { search = '', sources }) {
    const resolvedArgs = sources
      ? {
          source: {
            [Op.in]: sources
          }
        }
      : {};

    return Series.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        ...resolvedArgs
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
