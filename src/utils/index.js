import Strings from '@/constants/strings';

export const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)));

const isTypeOf = (t) => (v) => typeof v === t;
export const isObject = isTypeOf(Strings.object);
export const isString = isTypeOf(Strings.string);
export const isNumber = isTypeOf(Strings.number);
export const isArray = (v) => v instanceof Array;

export const getWindowScrollPosition = () =>
  window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

export const createListeners = (t, f) => (el = document) => ({
  listen: () => el.addEventListener(t, f),
  remove: () => el.removeEventListener(t, f)
});

export function getElementCoordinates(elem) {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;
  const clientWidth = docEl.clientWidth;
  const clientHeight = docEl.clientHeight;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;
  return {
    top: Math.round(top),
    left: Math.round(left),
    right: Math.round(clientWidth - (left + box.width)),
    bottom: Math.round(clientHeight - (top + box.height))
  };
}

export const parseIfInt = (val) => {
  const maybeInt = parseInt(val, 10);
  return maybeInt === 0 || !!maybeInt ? maybeInt : val;
};

export const getEventValue = ({ type, checked, value }) =>
  type === Strings.checkbox
    ? checked
    : type === Strings.date || type === Strings.text
      ? value
      : parseIfInt(value);

export const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const capitaliseEachWord = (str) =>
  str
    .split(' ')
    .map(capitalise)
    .join(' ');

export const fromCamelCase = (str, separator = ' ') =>
  str
    .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase();

export const separateAndCapitalise = compose(
  capitalise,
  fromCamelCase
);

export const separateAndCapitaliseAll = compose(
  capitaliseEachWord,
  fromCamelCase
);

export const objectsAreEqual = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => objectsAreEqual(a[k], b[k]));
};

export const getItemFromData = (o) =>
  Object.keys(o)
    .map((k) => o[k])
    .pop();

export const generateUniqueId = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

export const convertToBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.onloadend = callback;
  reader.readAsDataURL(file);
};

export const castStringToBool = (val) =>
  val === 'true' ? true : val === 'false' ? false : val;

export const padNumber = (n, width, z = 0) => {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const get = (from, ...selectors) =>
  [...selectors].map((s) =>
    s
      .replace(/\[([^\[\]]*)\]/g, '.$1.') // eslint-disable-line
      .split('.')
      .filter((t) => t !== '')
      .reduce((prev, cur) => prev && prev[cur], from)
  );

export const orderBy = (arr, props, orders) =>
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
