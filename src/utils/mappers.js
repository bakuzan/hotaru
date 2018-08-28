import { isString, parseIfInt } from './index';

const mutationWrapper = (__typename, key, defaultObj = {}) => (obj) => ({
  __typename: 'Mutation',
  [key]: {
    __typename,
    ...defaultObj,
    ...obj
  }
});

export const mapEnumArrayToObject = (arr) =>
  arr.reduce((o, k) => ({ ...o, [k.toLowerCase()]: k }), {});

export const mapEnumToSelectBoxOptions = (arr) =>
  arr.reduce((a, k) => [...a, { value: k, text: k }], []);

export const mapToSelectBoxOptions = (arr) =>
  arr.map((x) => ({ value: x.id, text: x.name }));

export const mapCharacterToPost = (character, allTags) => {
  const {
    id,
    name,
    gender,
    displayImage,
    images = [],
    seriesId,
    tagIds = []
  } = character;
  const seriesIdInt = parseIfInt(seriesId);
  const removeSeries = isString(seriesIdInt);

  return {
    id,
    name,
    gender,
    displayImage,
    images,
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

export const mapCharacterToOptimisticUpdate = mutationWrapper(
  'Character',
  'characterUpdate'
);

export const mapCharacterToOptimisticCreate = mutationWrapper(
  'Character',
  'characterCreate',
  { id: -1 }
);

export const mapToCharacterTag = (tag) => ({
  id: tag.id,
  name: tag.name
});

export const mapSeriesToPost = (series) => {
  const { id, name, source, displayImage, characters = [] } = series;

  return {
    id,
    name,
    source,
    displayImage,
    characterIds: [...characters.map((x) => x.id)]
  };
};

export const mapSeriesToStore = (series) => ({
  __typename: 'Series',
  ...series
});

export const mapSeriesToOptimisticUpdate = mutationWrapper(
  'Series',
  'seriesUpdate'
);

export const mapSeriesToOptimisticCreate = mutationWrapper(
  'Series',
  'seriesCreate',
  { id: -1 }
);

export const mapMutationToListStore = (item) => {
  const { id, name, displayImage, __typename } = item;
  return { id, name, displayImage, __typename };
};
