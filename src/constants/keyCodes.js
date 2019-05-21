const keyCodes = Object.freeze({
  q: 81,
  backspace: 8,
  enter: 13,
  escape: 27,
  up: 38,
  down: 40,
  space: 32
});
export default keyCodes;

export const CLOSE_KEYS = [keyCodes.escape, keyCodes.enter];
export const OPEN_KEYS = [keyCodes.space, keyCodes.enter];