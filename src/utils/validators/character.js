import { validInstance, invalidInstance } from './common';

class CharacterValidator {
  __requiredState(character) {
    if (!character) {
      return invalidInstance('No instance');
    }
    if (!character.name || !character.name.trim()) {
      return invalidInstance('Name is required');
    }
    if (!character.gender) {
      return invalidInstance('Gender is required');
    }

    return validInstance();
  }

  isValidNew(character) {
    const requiredState = this.__requiredState(character);

    if (!requiredState.valid) {
      // send messages to user.
      return false;
    }

    return true;
  }

  isValidExisting(character) {
    const requiredState = this.__requiredState(character);

    if (!requiredState.valid) {
      // send messages to user.
      return false;
    }

    return true;
  }
}

const instance = new CharacterValidator();
export default instance;
