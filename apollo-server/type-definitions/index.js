const gql = require('graphql-tag');

const query = require('./query');
const enums = require('./enums');
const character = require('./character');
const series = require('./series');
const tag = require('./tag');
const image = require('./image');
const versus = require('./versus');
const ranking = require('./ranking');
const htrtemplate = require('./htr-template');
const htrinstance = require('./htr-instance');
const htrinstanceleague = require('./htr-instance-league');
const honours = require('./honours');
const gauntlet = require('./gauntlet');

module.exports = [
  ...query,
  ...enums,
  character,
  series,
  tag,
  image,
  versus,
  ranking,
  htrtemplate,
  htrinstance,
  htrinstanceleague,
  honours,
  gauntlet,
  gql`
    input Paging {
      size: Int
      page: Int
    }
  `
];
