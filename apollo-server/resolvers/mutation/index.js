const { Tag } = require('../../connectors');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const image = require('./image');
const htrtemplate = require('./htrTemplate');
const htrinstance = require('./htrInstance');
const htrinstanceleague = require('./htrInstanceLeague');
const gauntlet = require('./gauntlet');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...image,
  ...htrtemplate,
  ...htrinstance,
  ...htrinstanceleague,
  ...gauntlet,
  tagCreate(_, { tag }) {
    return Tag.create({ ...tag }).then((tag) => tag);
  }
};
