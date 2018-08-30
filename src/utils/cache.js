import { Query } from '@/graphql';
import { mapMutationToListStore } from '@/utils/mappers';

export const isLoading = (apollo, only = []) => {
  const { queries } = apollo;
  const keys = Object.keys(queries);
  const watching = only.length ? keys.filter((x) => only.includes(x)) : keys;
  return watching.some((k) => queries[k].loading);
};

export const refreshGetCharacters = (store, rawCharacter) => {
  const character = mapMutationToListStore(rawCharacter);

  const oldData = store.readQuerySafeHTR({
    query: Query.getCharacters,
    variables: { search: '' }
  });

  const alreadyExists =
    oldData.characters && oldData.characters.some((x) => x.id === character.id);

  let characters = oldData.characters || [];
  characters = !alreadyExists
    ? characters.concat([character])
    : characters.map((x) => (x.id !== character.id ? x : character));

  store.writeQuery({
    query: Query.getCharacters,
    variables: { search: '' },
    data: { characters }
  });
};

export const refreshAllTags = (store, rawCharacter) => {
  const character = { tags: [], ...rawCharacter };

  const oldData = store.readQuery({
    query: Query.allTags
  });

  const newTags = character.tags
    .filter((x) => !oldData.tags.some((y) => y.id === x.id))
    .map((x) => ({ ...x, __typename: 'Tag' }));

  const tags = oldData.tags.concat([...newTags]);

  store.writeQuery({
    query: Query.allTags,
    data: { tags }
  });
};

export const refreshGetSeries = (store, rawSeries) => {
  const item = mapMutationToListStore(rawSeries);

  const oldData = store.readQuerySafeHTR({
    query: Query.getSeries,
    variables: { search: '' }
  });

  const alreadyExists =
    oldData.series && oldData.series.some((x) => x.id === item.id);

  let series = oldData.series || [];
  series = !alreadyExists
    ? series.concat([item])
    : series.map((x) => (x.id !== item.id ? x : item));

  store.writeQuery({
    query: Query.getSeries,
    variables: { search: '' },
    data: { series }
  });
};

export const refreshCharacterSeriesFragment = (store, rawSeries) => {
  // Might not need
  console.log(
    '%c refresh character state post series mutation: not yet implemented',
    'color: red',
    store,
    rawSeries
  );
};
