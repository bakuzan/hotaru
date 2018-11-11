const { db, Tag } = require('../../connectors');
const SQL = require('../../db-scripts');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const image = require('./image');
const htrtemplate = require('./htr-template');
const htrinstance = require('./htr-instance');
const htrinstanceleague = require('./htr-instance-league');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...image,
  ...htrtemplate,
  ...htrinstance,
  ...htrinstanceleague,
  tagCreate(_, { tag }) {
    return Tag.create({ ...tag }).then((tag) => tag);
  },
  populateRankings() {
    return db.transaction((transaction) =>
      db
        .query(SQL['delete_from_rankings'], { transaction })
        .then(() => db.query(SQL['delete_rankings_sequence'], { transaction }))
        .then(() => db.query(SQL['drop_ranking_temp'], { transaction }))
        .then(() => db.query(SQL['generate_rankings'], { transaction }))
        .then(() => db.query(SQL['populate_rankings'], { transaction }))
        .then(() => db.query(SQL['drop_ranking_temp'], { transaction }))
        .then(() => ({ success: true, message: '' }))
        .catch((error) => ({ success: false, message: error.message }))
    );
  }
};
