const Op = require('sequelize').Op;

const { Character } = require('../../connectors');

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
  charactersWithoutSeries(_, { search = '' }) {
    return Character.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        seriesId: {
          [Op.eq]: null
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
  }
};
