const enumArrayToObject = (arr) =>
  arr.slice(0).reduce((p, c) => ({ ...p, [c]: c }), {});

module.exports = {
  enumArrayToObject
};
