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
    images: images.map(
      (x) => (isString(x.id) ? { url: x.url } : { id: x.id, url: x.url })
    ),
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

const optimisticCharacterModel = (obj, allTags) => {
  const { images = [], seriesId, tagIds = [], ...other } = obj;
  const seriesIdInt = parseIfInt(seriesId);
  const removeSeries = isString(seriesIdInt);

  return {
    ...other,
    images,
    seriesId: removeSeries ? null : seriesIdInt,
    tags: [
      ...allTags
        .filter((x) => tagIds.includes(x.id))
        .map((x) => ({ ...x, __typename: 'Tag' }))
    ]
  };
};
export const mapCharacterToOptimisticUpdate = (obj, allTags) => {
  const mappedObj = optimisticCharacterModel(obj, allTags);
  return mutationWrapper('Character', 'characterUpdate')(mappedObj);
};
export const mapCharacterToOptimisticCreate = (obj, allTags) => {
  const mappedObj = optimisticCharacterModel(obj, allTags);
  return mutationWrapper('Character', 'characterCreate', { id: -1 })(mappedObj);
};

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

const optimisticSeriesModel = ({ characters = [], ...series }) => ({
  ...series,
  characters: [...characters.map((x) => ({ ...x, seriesId: series.id }))]
});
export const mapSeriesToOptimisticUpdate = (obj) => {
  const mappedObj = optimisticSeriesModel(obj);
  return mutationWrapper('Series', 'seriesUpdate')(mappedObj);
};
export const mapSeriesToOptimisticCreate = (obj) => {
  const mappedObj = optimisticSeriesModel(obj);
  return mutationWrapper('Series', 'seriesCreate', { id: -1 })(mappedObj);
};

export const mapMutationToListStore = (item) => {
  const { id, name, displayImage, __typename } = item;
  return { id, name, displayImage, __typename };
};

export const mapVersusToVotedVersus = mutationWrapper('Versus', 'versusVote');
