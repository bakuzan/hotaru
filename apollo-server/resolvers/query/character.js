const Op = require('sequelize').Op;

const { db, Character, Series } = require('../../connectors');
const Utils = require('../../utils');

module.exports = {
  charactersPaged(_, { search = '', genders, sources, paging = {} }) {
    const resolvedArgs = {
      ...Utils.ifArrayThenIn(genders, {
        gender: {
          [Op.in]: genders
        }
      }),
      ...Utils.ifArrayThenIn(sources, {
        source: db.where(db.col('series.source'), {
          [Op.in]: sources
        })
      })
    };

    return Character.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        ...resolvedArgs
      },
      order: [['name', 'ASC']],
      limit: paging.size,
      offset: paging.size * paging.page,
      include: [Series]
    }).then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: Utils.setHasMoreFlag(result.count, paging)
    }));
  },
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
    return Character.findByPk(id);
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
    return Character.findByPk(characterId).then((character) =>
      character.getImages({ where: args })
    );
  },
  characterRandom() {
    return Character.findOne({
      order: db.literal('RANDOM()')
    });
  },
  charactersForTemplateRules(_, args, context) {
    return context.Character.findFromRules(args);
  },
  async characterCountForTemplateRules(_, args, context) {
    return context.Character.countFromRules(args);
  },
  async checkCharacterAlreadyExists(_, { id = null, name, seriesId }) {
    const lowerTrimmedName = name.trim().toLowerCase();
    const count = await Character.count({
      where: {
        id: { [Op.ne]: id },
        name: db.where(db.fn('LOWER', db.col('name')), {
          [Op.eq]: lowerTrimmedName
        }),
        seriesId
      }
    });

    return count !== 0;
  }
};
