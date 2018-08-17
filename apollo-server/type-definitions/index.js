const query = require('./query');
const enums = require('./enums');
const character = require('./character');
const series = require('./series');
const tag = require('./tag');

module.exports = [...query, ...enums, character, series, tag];
