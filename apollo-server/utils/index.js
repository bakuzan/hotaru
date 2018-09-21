const Op = require('sequelize').Op;

const enumArrayToObject = (arr) =>
  arr
    .slice(0)
    .reduce(
      (p, c) =>
        typeof c === 'object' ? { ...p, [c.name]: c.id } : { ...p, [c]: c },
      {}
    );

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

const resolveInOp = (b, arr) => (b && arr.length ? Op.in : Op.notIn);

function shuffleArray(arr) {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const get = (from, ...selectors) =>
  [...selectors].map((s) =>
    s
      .replace(/\[([^\[\]]*)\]/g, '.$1.') // eslint-disable-line
      .split('.')
      .filter((t) => t !== '')
      .reduce((prev, cur) => prev && prev[cur], from)
  );

const orderBy = (arr, props, orders) =>
  [...arr].sort((a, b) =>
    props.reduce((acc, prop, i) => {
      const aVal = get(a, prop)[0];
      const bVal = get(b, prop)[0];
      if (acc === 0) {
        const [p1, p2] =
          orders && orders[i] === 'desc' ? [bVal, aVal] : [aVal, bVal];
        acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
      }
      return acc;
    }, 0)
  );

module.exports = {
  enumArrayToObject,
  mapArrToGraphqlString,
  separateArrIntoNewAndExisting,
  chunk,
  roundFloat,
  castStringToBool,
  resolveInOp,
  shuffleArray,
  orderBy
};
