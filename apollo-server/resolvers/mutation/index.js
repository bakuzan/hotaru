const { Tag } = require('../../connectors');

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
  }
};
