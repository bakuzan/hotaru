const keyCodes = Object.freeze({
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  Backspace: 'Backspace',
  Enter: 'Enter',
  Escape: 'Escape',
  Space: ' ',
  KeyQ: 'q'
});

export default keyCodes;

export const CLOSE_KEYS = [keyCodes.Escape, keyCodes.Enter];
export const OPEN_KEYS = [keyCodes.Space, keyCodes.Enter];
export const ARROW_KEYS = [
  keyCodes.ArrowUp,
  keyCodes.ArrowDown,
  keyCodes.ArrowLeft,
  keyCodes.ArrowRight
];
