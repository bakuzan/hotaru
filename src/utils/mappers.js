import { isString, parseIfInt, getItemFromData, getKeyForData } from './index';
import { Orders } from '@/constants/htr-instance-settings';

// eslint-disable-next-line
const mapWithoutTypename = ({ __typename, ...o }) => ({ ...o });

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

export const mapEnumToRadioButtonGroup = (arr) =>
  arr.map((x) => ({ text: x, value: x }));

export const mapCharacterToPost = (character, allTags) => {
  const {
    id,
    name,
    gender,
    displayImage,
    isWaifu,
    images,
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
    isWaifu,
    images: !images
      ? undefined
      : images.map(
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
    images: images.map((x) => ({ ...x, __typename: 'Image' })),
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

export const mapHTRTemplateToPost = (template, isCreate) => {
  const { id, name, type, rules } = template;
  const { genders, sources, limit, isSeeded } = rules;
  const resolvedType = isCreate ? { type } : {};
  return {
    id,
    name,
    ...resolvedType,
    rules: {
      limit: Number(limit) || null,
      isSeeded,
      genders,
      sources,
      series: rules.series.map((x) => x.id)
    }
  };
};

export const mapHTRInstanceToPost = (instance, isCreate) => {
  const { id, name, description, htrTemplate, characters, settings } = instance;
  const {
    limit,
    order,
    customOrder = [],
    rules,
    status,
    layout,
    winnerId
  } = settings;
  const resolvedRules = isCreate ? {} : { rules: mapWithoutTypename(rules) };
  const resolvedCharacters =
    characters && characters.length ? [...characters.map((x) => x.id)] : [];

  return {
    id,
    name,
    description,
    htrTemplateId: htrTemplate.id,
    characterIds: resolvedCharacters,
    settings: {
      limit: Number(limit),
      order: order ? Number(order) : undefined,
      customOrder:
        Number(order) === Orders.custom ? customOrder.slice(0) : null,
      ...resolvedRules,
      layout,
      status,
      winnerId
    }
  };
};

export const mapHTRInstanceToStore = (instance) => ({
  __typename: 'HTRInstance',
  ...instance
});

export const mapHTRInstanceToOptimisticUpdate = (instance) => {
  const mappedObj = {
    ...instance,
    settings: {
      ...instance.settings,
      customOrder: instance.settings.customOrder
        ? [...instance.settings.customOrder]
        : null
    }
  };

  return mutationWrapper('HTRInstance', 'htrInstanceUpdate')(mappedObj);
};

export const mapPagedResponseToUpdate = (
  previousResult,
  { fetchMoreResult }
) => {
  const key = getKeyForData(previousResult);
  const prev = getItemFromData(previousResult);
  const data = getItemFromData(fetchMoreResult);
  return {
    [key]: {
      __typename: prev.__typename,
      ...data,
      nodes: [...prev.nodes, ...data.nodes]
    }
  };
};
