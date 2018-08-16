export const getParams = (router) => router.history.current.params;
export const getParam = (router, key) => getParams(router)[key];
