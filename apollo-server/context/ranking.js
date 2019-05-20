const { db } = require('../connectors');
const SQL = require('../db-scripts');

const processArray = require('./utils/processArray');

module.exports = {
  async prepRankings(opts = {}) {
    await db.query(SQL['drop_ranking_temp'], opts);
    await db.query(SQL['generate_rankings_v2'], opts);
  },
  async getRankings({ search, skipNum, takeNum, ...args }, opts = {}) {
    const genders = processArray(args.genders);
    const sources = processArray(args.sources);
    const seriesIds = processArray(args.seriesIds);
    const characterIds = processArray(args.characterIds);

    await this.prepRankings(opts);
    return await db.query(SQL['get_rankings'], {
      type: db.QueryTypes.SELECT,
      replacements: {
        search: `%${search}%`,
        genders,
        sources,
        seriesIds,
        characterIds,
        skipNum,
        takeNum
      },
      ...opts
    });
  }
};
