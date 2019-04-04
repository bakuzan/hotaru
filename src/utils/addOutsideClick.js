import keyCodes from '../constants/key-codes';
import { createListeners } from './index';

export default function addOutsideClick(element, onOutsideClick) {
  function handleClick(event) {
    const isDescendantOfRoot = element.contains(event.target);

    if (!isDescendantOfRoot) {
      onOutsideClick(event);
    }
  }

  function handleKeyDown(event) {
    if (keyCodes.escape === event.keyCode) {
      onOutsideClick(event);
    }
  }

  const keyCtrl = createListeners('keydown', handleKeyDown)();
  keyCtrl.listen();

  const clickCtrl = createListeners('click', handleClick)();
  clickCtrl.listen();

  return () => {
    keyCtrl.remove();
    clickCtrl.remove();
  };
}
