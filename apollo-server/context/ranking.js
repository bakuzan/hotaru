const { db } = require('../connectors');
const SQL = require('../db-scripts');

const processArray = require('./utils/processArray');
const handleRankingDateRange = require('./utils/handleRankingDateRange');

function processArgs(args) {
  return {
    genders: processArray(args.genders),
    sources: processArray(args.sources),
    seriesIds: processArray(args.seriesIds),
    characterIds: processArray(args.characterIds)
  };
}

module.exports = {
  async prepRankings(opts = {}, dateRange) {
    const [fromDate, toDate] = handleRankingDateRange(dateRange);

    await db.query(SQL['drop_ranking_temp'], opts);
    await db.query(SQL['generate_rankings_v2'], {
      ...opts,
      replacements: {
        fromDate,
        toDate
      }
    });
  },
  async getRankings(
    { search, skipNum, takeNum, fromDate, toDate, ...args },
    opts = {}
  ) {
    const pArgs = processArgs(args);

    await this.prepRankings(opts, [fromDate, toDate]);
    return await db.query(SQL['get_rankings'], {
      type: db.QueryTypes.SELECT,
      replacements: {
        search: `%${search}%`,
        skipNum,
        takeNum,
        ...pArgs
      },
      ...opts
    });
  },
  async getRankingsAndCount(args, opts) {
    const pArgs = processArgs(args);

    const nodes = await this.getRankings(args, opts);
    const [count] = await db.query(SQL['get_rankings_count'], {
      type: db.QueryTypes.SELECT,
      replacements: {
        search: `%${args.search}%`,
        ...pArgs
      },
      ...opts
    });

    const total = count && count.total ? count.total : 0;
    return { nodes, total };
  }
};
