const Op = require('sequelize').Op;

const { db: context, Character } = require('../../connectors');

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
  charactersByIds(_, { characterIds = [] }) {
    return Character.findAll({
      where: {
        id: {
          [Op.in]: characterIds
        }
      }
    });
  },
  characterImages(_, { characterId, ...args }) {
    return Character.findById(characterId).then((character) =>
      character.getImages({ where: args })
    );
  },
  characterRandom() {
    return Character.findOne({
      order: context.literal('RANDOM()')
    });
  }
};
