const { db: context, Tag } = require('../../connectors');
const SQL = require('../../db-scripts');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const image = require('./image');
const htrtemplate = require('./htr-template');
const htrinstance = require('./htr-instance');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...image,
  ...htrtemplate,
  ...htrinstance,
  tagCreate(_, { tag }) {
    return Tag.create({ ...tag }).then((tag) => tag);
  },
  populateRankings() {
    return context.transaction((transaction) =>
      context
        .query(SQL['delete_from_rankings'], { transaction })
        .then(() => context.query(SQL['drop_ranking_temp'], { transaction }))
        .then(() => context.query(SQL['generate_rankings'], { transaction }))
        .then(() => context.query(SQL['populate_rankings'], { transaction }))
        .then(() => context.query(SQL['drop_ranking_temp'], { transaction }))
        .then(() => ({ success: true, message: '' }))
        .catch((error) => ({ success: false, message: error.message }))
    );
  }
};
