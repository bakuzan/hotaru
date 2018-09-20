import alertService from '@/utils/alert-service';

class FormValidator {
  constructor(
    required,
    requiredNew = () => new ValidatorResponse(),
    requiredExisting = () => new ValidatorResponse()
  ) {
    this.__requiredValidator = required;
    this.__requiredNewValidator = requiredNew;
    this.__requiredExistingValidator = requiredExisting;
  }

  __createStringFromMessages(...states) {
    return states.reduce((p, s) => [...p, ...s], []).join('\n');
  }

  isValidNew(obj) {
    const requiredState = this.__requiredValidator(obj).get();
    const requiredNewState = this.__requiredNewValidator(obj).get();

    if (!requiredState.valid || !requiredNewState.valid) {
      alertService.sendError({
        message: 'Invalid Create State',
        detail: this.__createStringFromMessages(
          requiredState.messages,
          requiredNewState.messages
        )
      });
      return false;
    }

    return true;
  }

  isValidExisting(obj) {
    const requiredState = this.__requiredValidator(obj).get();
    const requiredExistingState = this.__requiredExistingValidator(obj).get();

    if (!requiredState.valid || !requiredExistingState.valid) {
      alertService.sendError({
        message: 'Invalid Edit State',
        detail: this.__createStringFromMessages(
          requiredState.messages,
          requiredExistingState.messages
        )
      });
      return false;
    }

    return true;
  }
}

export default FormValidator;

export class ValidatorResponse {
  constructor() {
    this.__valid = true;
    this.__messages = [];
  }

  get() {
    return { valid: this.__valid, messages: this.__messages };
  }

  updateResponse(valid, message = 'Invalid') {
    this.__valid = this.__valid && !!valid;
    if (!valid) {
      this.__messages = [...this.__messages, message];
    }
  }
}
