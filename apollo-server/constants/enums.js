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

module.exports = {
  GenderType,
  SourceType,
  VersusType,
  HTRTemplateType,
  BracketStatus
};
