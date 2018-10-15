import { compose, castStringToBool, parseIfInt } from './index';

export const getParams = (router) => router.history.current.params;
export const getParam = (router, key) => getParams(router)[key];
export const getRouteName = (router) => router.history.current.name;
export const getQueryArg = (router, key, defaultValue) =>
  router.history.current.query[key] || defaultValue;

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
  if (!query) return defaultValue;

  const obj = constructObjectFromSearchParams(query);
  return obj[key] || defaultValue;
};
