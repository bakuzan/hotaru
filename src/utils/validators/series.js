import Validator, { ValidatorResponse } from './validatorBase';

const instance = new Validator((series) => {
  const response = new ValidatorResponse();

  response.updateResponse(series, 'No instance');
  response.updateResponse(
    series.name && series.name.trim(),
    'Name is required'
  );
  response.updateResponse(series.source, 'Source is required');

  return response;
});

export default instance;
