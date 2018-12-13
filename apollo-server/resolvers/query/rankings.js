const Op = require('sequelize').Op;

const { db, Character, Series, Ranking } = require('../../connectors');

const Utils = require('../../utils');

module.exports = {
  rankingsTopTen() {
    return Ranking.findAll({
      order: [['rank', 'asc']],
      limit: 10,
      include: [Character]
    });
  },
  rankingsPaged(
    _,
    { search = '', genders, sources, series, paging = { page: 0, size: 10 } }
  ) {
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
      }),
      ...Utils.ifArrayThenIn(series, {
        seriesId: {
          [Op.in]: series
        }
      })
    };

    return Character.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        ...resolvedArgs
      },
      order: [[Character.Ranking, 'rank', 'ASC']],
      limit: paging.size,
      offset: paging.size * paging.page,
      include: [Series, Ranking]
    }).then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: Utils.setHasMoreFlag(result.count, paging)
    }));
  }
};
