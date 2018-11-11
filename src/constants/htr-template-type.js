import { mapEnumArrayToObject } from '@/utils/mappers';

const HTRTemplateType = Object.freeze(['Bracket', 'List']);
export default HTRTemplateType;

export const HTRTemplateTypes = Object.freeze(
  mapEnumArrayToObject(HTRTemplateType)
);

export const HTRTemplateTypeLeague = 'League';
