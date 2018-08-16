import { mapEnumArrayToObject } from 'utils/enums';

const GenderType = Object.freeze(['Male', 'Female', 'None', 'Other']);
export default GenderType;

export const GenderTypes = Object.freeze(mapEnumArrayToObject(GenderType));
