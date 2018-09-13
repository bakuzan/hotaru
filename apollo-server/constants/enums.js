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
  { id: 2, name: 'Name Asc' },
  { id: 3, name: 'Rank Desc' },
  { id: 4, name: 'Custom' }
]);

module.exports = {
  GenderType,
  SourceType,
  VersusType,
  HTRTemplateType,
  BracketStatus,
  Order
};
