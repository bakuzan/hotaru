import { mapEnumArrayToObject } from '@/utils/mappers';

const BracketStatus = Object.freeze(['NotStarted', 'InProgress', 'Complete']);
export default BracketStatus;

export const BracketStatuses = Object.freeze(
  mapEnumArrayToObject(BracketStatus)
);
