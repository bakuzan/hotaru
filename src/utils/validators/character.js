import Validator, { ValidatorResponse } from './validator-base';

const instance = new Validator((character) => {
  const response = new ValidatorResponse();

  response.updateResponse(character, 'No instance');
  response.updateResponse(
    character.name && character.name.trim(),
    'Name is required'
  );
  response.updateResponse(character.gender, 'Gender is required');

  return response;
});

export default instance;
