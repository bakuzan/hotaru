import { compose, castStringToBool, parseIfInt } from './index';

export const getParams = (router) => router.history.current.params;
export const getParam = (router, key) => getParams(router)[key];
export const getRouteName = (router) => router.history.current.name;
export const getQueryArg = (router, key, defaultValue) => {
  console.log('get uery', router.history.current, key, defaultValue);
  return router.history.current.query[key] || defaultValue;
};

const parseSearchParamValue = compose(
  castStringToBool,
  parseIfInt,
  decodeURIComponent
);
const constructObjectFromSearchParams = (searchParam = '') =>
  searchParam
    .slice(1)
    .split('&')
    .reduce((p, c) => {
      const [key, raw] = c.split('=');
      const value = parseSearchParamValue(raw);
      return { ...p, [key]: value };
    }, {});

export const getQueryFromLocation = (key, defaultValue) => {
  const query = window.location.search;
  console.log('query raw', window.location, query);
  if (!query) return defaultValue;

  const obj = constructObjectFromSearchParams(query);
  console.log('query obj', obj, key);
  return obj[key] || defaultValue;
};
