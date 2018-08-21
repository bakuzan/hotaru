import { mapEnumArrayToObject } from '@/utils/mappers';

const SourceType = Object.freeze([
  'Anime',
  'Manga',
  'Comic',
  'Game',
  'Movie',
  'Other'
]);
export default SourceType;

export const SourceTypes = Object.freeze(mapEnumArrayToObject(SourceType));
