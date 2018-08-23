import { invalidInstance } from './common';

class SeriesValidator {
  __requiredState(series) {
    if (!series) return invalidInstance('No instance');
    if (!series.name || !series.name.trim()) {
      return invalidInstance('Name is required');
    }
    if (!series.source) return invalidInstance('Source is required');
  }

  isValidNew(series) {
    const requiredState = this.__requiredState(series);

    if (!requiredState.valid) {
      // send messages to user.
      return false;
    }

    return true;
  }

  isValidExisting(series) {
    const requiredState = this.__requiredState(series);

    if (!requiredState.valid) {
      // send messages to user.
      return false;
    }

    return true;
  }
}

const instance = new SeriesValidator();
export default instance;
