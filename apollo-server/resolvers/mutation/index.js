const { db: context, Tag } = require('../../connectors');
const SQL = require('../../db-scripts');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const image = require('./image');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...image,
  tagCreate(_, { tag }) {
    return Tag.create({ ...tag }).then((tag) => tag);
  },
  populateRankings() {
    return context
      .query(SQL['delete_from_rankings'])
      .then(() => context.query(SQL['drop_ranking_temp']))
      .then(() => context.query(SQL['generate_rankings']))
      .then(() => context.query(SQL['populate_rankings']))
      .then(() => context.query(SQL['drop_ranking_temp']))
      .then(() => ({ success: true, message: '' }))
      .catch((error) => ({ success: false, message: error.message }));
  }
};
