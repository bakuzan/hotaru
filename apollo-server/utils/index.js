const enumArrayToObject = (arr) =>
  arr.slice(0).reduce((p, c) => ({ ...p, [c]: c }), {});

const mapArrToGraphqlString = (arr) => arr.join(' ');

module.exports = {
  enumArrayToObject,
  mapArrToGraphqlString
};
