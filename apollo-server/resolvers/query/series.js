const Op = require('sequelize').Op;

const { db, Series, Character } = require('../../connectors');
const Utils = require('../../utils');

module.exports = {
  seriesPaged(_, { search = '', sources, paging = {} }) {
    const resolvedArgs = sources
      ? {
          source: {
            [Op.in]: sources
          }
        }
      : {};

    return Series.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        ...resolvedArgs
      },
      order: [['name', 'ASC']],
      limit: paging.size,
      offset: paging.size * paging.page
    }).then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: Utils.setHasMoreFlag(result.count, paging)
    }));
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
    return Series.findByPk(id, {
      include: [Character]
    });
  },
  async checkSeriesAlreadyExists(_, { id = null, name }) {
    const lowerTrimmedName = name.trim().toLowerCase();
    const count = await Series.count({
      where: {
        id: { [Op.ne]: id },
        name: db.where(db.fn('LOWER', db.col('name')), {
          [Op.eq]: lowerTrimmedName
        })
      }
    });

    return count !== 0;
  }
};
