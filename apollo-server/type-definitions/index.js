const query = require('./query');
const enums = require('./enums');
const character = require('./character');
const series = require('./series');
const tag = require('./tag');
const image = require('./image');
const versus = require('./versus');
const ranking = require('./ranking');

module.exports = [
  ...query,
  ...enums,
  character,
  series,
  tag,
  image,
  versus,
  ranking
];
