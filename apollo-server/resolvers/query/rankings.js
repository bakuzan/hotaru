const Op = require('sequelize').Op;

const { db, Character, Series } = require('../../connectors');

const Utils = require('../../utils');

module.exports = {
  async rankingsTopTen(_, __, context) {
    return await context.Ranking.getRankings({
      search: '',
      genders: null,
      sources: null,
      seriesIds: null,
      characterIds: null,
      skipNum: 0,
      takeNum: 10
    });
  },
  async rankingsPaged(
    _,
    {
      search = '',
      genders,
      sources,
      series,
      fromDate,
      toDate,
      paging = { page: 0, size: 10 }
    },
    context
  ) {
    const offset = paging.size * paging.page;
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

    const { nodes, total } = await context.Ranking.getRankingsAndCount({
      search,
      genders,
      sources,
      seriesIds: series,
      skipNum: offset,
      takeNum: paging.size,
      fromDate,
      toDate
    });

    return {
      nodes,
      total,
      hasMore: Utils.setHasMoreFlag(total, paging)
    };
  }
};
