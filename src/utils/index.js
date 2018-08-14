export const getWindowScrollPosition = () =>
  window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

export const createListeners = (t, f) => (el = document) => ({
  listen: () => el.addEventListener(t, f),
  remove: () => el.removeEventListener(t, f)
});
