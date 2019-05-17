const { db } = require('../connectors');
const SQL = require('../db-scripts');

function guardEmptyArray(arr = []) {
  return arr && arr.length ? arr : null;
}

module.exports = {
  async prepRankings(opts = {}) {
    await db.query(SQL['drop_ranking_temp'], opts);
    await db.query(SQL['generate_rankings_v2'], opts);
  },
  async getRankings({ search, skipNum, takeNum, ...args }, opts = {}) {
    const genders = guardEmptyArray(args.genders);
    const sources = guardEmptyArray(args.sources);
    const seriesIds = guardEmptyArray(args.seriesIds);
    const characterIds = guardEmptyArray(args.characterIds);

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
