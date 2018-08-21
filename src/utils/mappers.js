import { isString, parseIfInt } from './index';

export const mapEnumArrayToObject = (arr) =>
  arr.reduce((o, k) => ({ ...o, [k.toLowerCase()]: k }), {});

export const mapEnumToSelectBoxOptions = (arr) =>
  arr.reduce((a, k) => [...a, { value: k, text: k }], []);

export const mapToSelectBoxOptions = (arr) =>
  arr.map((x) => ({ value: x.id, text: x.name }));

export const mapCharacterToPost = (character, allSeries, allTags) => {
  const { id, name, gender, displayImage, seriesId, tagIds = [] } = character;
  const seriesIdInt = parseIfInt(seriesId);
  const removeSeries = isString(seriesIdInt);

  return {
    id,
    name,
    gender,
    displayImage,
    series: removeSeries ? null : allSeries.find((x) => x.id === seriesIdInt),
    tags: [
      ...allTags
        .filter((x) => tagIds.includes(x.id))
        .map((x) => (isString(x.id) ? { name: x.name } : { ...x }))
    ]
  };
};

export const mapCharacterToStore = (character) => {
  const { series = {}, tags = [], ...pass } = character;
  return {
    ...pass,
    seriesId: series ? series.id : null,
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
