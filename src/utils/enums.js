export const mapEnumArrayToObject = (arr) =>
  arr.reduce((o, k) => ({ ...o, [k.toLowerCase()]: k }), {});
