import Validator, { ValidatorResponse } from './validatorBase';
import { HTRTemplateTypes } from '@/constants/htrTemplateType';

const instance = new Validator((obj) => {
  const response = new ValidatorResponse();

  response.updateResponse(obj, 'No instance');
  response.updateResponse(obj.name && obj.name.trim(), 'Name is required');
  response.updateResponse(
    obj.description && obj.description.trim(),
    'Description is required'
  );
  response.updateResponse(obj.htrTemplate, 'No template provided');

  response.updateResponse(
    obj.settings && obj.settings.limit,
    'Limit is required'
  );

  const { type } = obj.htrTemplate || {};
  if (type === HTRTemplateTypes.list) {
    response.updateResponse(
      obj.settings && obj.settings.order,
      'Order is required'
    );
  }

  return response;
});

export default instance;
