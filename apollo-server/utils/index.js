const Op = require('sequelize').Op;

const enumArrayToObject = (arr) =>
  arr.slice(0).reduce((p, c) => ({ ...p, [c]: c }), {});

const mapArrToGraphqlString = (arr) => arr.join(' ');

const separateArrIntoNewAndExisting = (arr) => {
  const newItems = arr.filter((x) => !x.id);
  const existingItemIds = arr.filter((x) => x.id).map((x) => x.id);

  return { newItems, existingItemIds };
};

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

function roundFloat(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? +value[1] + exp : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp));
}

const castStringToBool = (val) =>
  val === 'true' ? true : val === 'false' ? false : !!val;

const resolveInOp = (b) => (b ? Op.in : Op.notIn);

module.exports = {
  enumArrayToObject,
  mapArrToGraphqlString,
  separateArrIntoNewAndExisting,
  chunk,
  roundFloat,
  castStringToBool,
  resolveInOp
};
