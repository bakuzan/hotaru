const query = require('./query');
const enums = require('./enums');
const character = require('./character');
const series = require('./series');

module.exports = [...query, ...enums, character, series];
