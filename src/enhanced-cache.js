import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';

function readQuerySafe(options) {
  try {
    return this.readQuery(options);
  } catch (e) {
    return {};
  }
}

function deleteQuery(name) {
  const names = name instanceof Array ? name : [name];
  let rootQuery = this.data.data.ROOT_QUERY;

  if (!rootQuery) {
    return;
  }

  Object.keys(rootQuery)
    .filter((query) => names.some((name) => query.indexOf(name) === 0))
    .forEach((query) => {
      delete rootQuery[query];
    });
}

export default () => {
  InMemoryCache.prototype.readQuerySafeHTR = readQuerySafe;
  InMemoryCache.prototype.deleteQueryHTR = deleteQuery;

  return new InMemoryCache({
    dataIdFromObject: (object) => {
      switch (object.__typename) {
        case 'HonoursCharacter':
          return `HonoursCharacter:${object.id}:${object.key}`;
        default:
          return defaultDataIdFromObject(object);
      }
    }
  });
};
