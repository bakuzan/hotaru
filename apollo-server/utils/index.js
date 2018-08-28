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

module.exports = {
  enumArrayToObject,
  mapArrToGraphqlString,
  separateArrIntoNewAndExisting,
  chunk
};
