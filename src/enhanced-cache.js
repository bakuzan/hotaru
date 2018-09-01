import { InMemoryCache } from 'apollo-cache-inmemory';

function makeSafe(query, options) {
  try {
    return query(options);
  } catch (e) {
    return {};
  }
}

function readQuerySafe(options) {
  return makeSafe(this.readQuery, options);
}

function deleteQuery(name) {
  const names = name instanceof Array ? name : [name];
  let rootQuery = this.data.data.ROOT_QUERY;
  Object.keys(rootQuery)
    .filter((query) => names.some((name) => query.indexOf(name) === 0))
    .forEach((query) => {
      delete rootQuery[query];
    });
}

export default () => {
  InMemoryCache.prototype.readQuerySafeHTR = readQuerySafe;
  InMemoryCache.prototype.deleteQueryHTR = deleteQuery;

  return new InMemoryCache();
};
