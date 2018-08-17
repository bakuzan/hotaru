export const getParams = (router) => router.history.current.params;
export const getParam = (router, key) => getParams(router)[key];

export const getRouteName = (router) => router.history.current.name;
