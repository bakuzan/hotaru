import Validator, { ValidatorResponse } from './validator-base';

const instance = new Validator((template) => {
  const response = new ValidatorResponse();

  response.updateResponse(template, 'No instance');
  response.updateResponse(
    template.name && template.name.trim(),
    'Name is required'
  );
  response.updateResponse(template.type, 'Type is required');

  return response;
});

export default instance;
