import { isString, parseIfInt } from './index';

export const mapEnumArrayToObject = (arr) =>
  arr.reduce((o, k) => ({ ...o, [k.toLowerCase()]: k }), {});

export const mapEnumToSelectBoxOptions = (arr) =>
  arr.reduce((a, k) => [...a, { value: k, text: k }], []);

export const mapToSelectBoxOptions = (arr) =>
  arr.map((x) => ({ value: x.id, text: x.name }));

export const mapCharacterToPost = (character) => {
  const { id, name, gender, displayImage, seriesId, tagIds = [] } = character;
  const seriesIdInt = parseIfInt(seriesId);
  return {
    id,
    name,
    gender,
    displayImage,
    seriesId: isString(seriesIdInt) ? null : seriesIdInt,
    tagIds
  };
};

const mutationWrapper = (obj) => ({
  __typename: 'Mutation',
  ...obj
});

export const mapCharacterToOptimisticUpdate = (character) =>
  mutationWrapper({
    characterUpdate: {
      __typename: 'Character',
      ...character
    }
  });
