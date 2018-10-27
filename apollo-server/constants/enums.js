const enumArrayToObject = require('../utils').enumArrayToObject;

const GenderType = Object.freeze(['Male', 'Female', 'None', 'Other']);

const SourceType = Object.freeze([
  'Anime',
  'Manga',
  'Comic',
  'Game',
  'Movie',
  'Other'
]);

const VersusType = Object.freeze(['Daily', 'Single', 'List', 'Bracket']);

const HTRTemplateType = Object.freeze(['Bracket', 'List']);

const BracketStatus = Object.freeze(['NotStarted', 'InProgress', 'Complete']);

const Order = Object.freeze([
  { id: 1, name: 'None' },
  { id: 2, name: 'Name' },
  { id: 3, name: 'Rank' },
  { id: 4, name: 'Custom' }
]);

const BracketSizes = Object.freeze([128, 64, 32, 16, 8]);

module.exports = {
  GenderType,
  GenderTypes: enumArrayToObject(GenderType),
  SourceType,
  SourceTypes: enumArrayToObject(SourceType),
  VersusType,
  VersusTypes: enumArrayToObject(VersusType),
  HTRTemplateType,
  HTRTemplateTypes: enumArrayToObject(HTRTemplateType),
  BracketStatus,
  BracketStatuses: enumArrayToObject(BracketStatus),
  Order,
  Orders: enumArrayToObject(Order),
  BracketSizes
};
