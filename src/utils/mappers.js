import { isString, parseIfInt } from './index';

export const mapEnumArrayToObject = (arr) =>
  arr.reduce((o, k) => ({ ...o, [k.toLowerCase()]: k }), {});

export const mapEnumToSelectBoxOptions = (arr) =>
  arr.reduce((a, k) => [...a, { value: k, text: k }], []);

export const mapToSelectBoxOptions = (arr) =>
  arr.map((x) => ({ value: x.id, text: x.name }));

export const mapCharacterToPost = (character, allTags) => {
  const { id, name, gender, displayImage, seriesId, tagIds = [] } = character;
  const seriesIdInt = parseIfInt(seriesId);
  const removeSeries = isString(seriesIdInt);

  return {
    id,
    name,
    gender,
    displayImage,
    seriesId: removeSeries ? null : seriesIdInt,
    tags: [
      ...allTags
        .filter((x) => tagIds.includes(x.id))
        .map((x) => (isString(x.id) ? { name: x.name } : mapToCharacterTag(x)))
    ]
  };
};

export const mapCharacterToStore = (character) => {
  const { tags = [], ...pass } = character;
  return {
    __typename: 'Character',
    ...pass,
    tagIds: tags.map((x) => x.id)
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

export const mapCharacterToOptimisticCreate = (character) =>
  mutationWrapper({
    characterCreate: {
      __typename: 'Character',
      id: -1,
      ...character
    }
  });

export const mapToCharacterTag = (tag) => ({
  id: tag.id,
  name: tag.name
});
