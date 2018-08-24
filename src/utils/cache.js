import { Query } from '@/graphql';
import { mapMutationToListStore } from '@/utils/mappers';

export const refreshGetCharacters = (store, rawCharacter) => {
  const character = mapMutationToListStore(rawCharacter);

  const oldData = store.readQuery({
    query: Query.getCharacters,
    variables: { search: '' }
  });

  const alreadyExists = oldData.characters.some((x) => x.id === character.id);

  const characters = !alreadyExists
    ? oldData.characters.concat([character])
    : oldData.characters.map((x) => (x.id !== character.id ? x : character));

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
    .map((x) => ({ id: -1, ...x, __typename: 'Tag' }));

  const tags = oldData.tags.concat([...newTags]);

  store.writeQuery({
    query: Query.allTags,
    data: { tags }
  });
};

export const refreshGetSeries = (store, rawSeries) => {
  const item = mapMutationToListStore(rawSeries);

  const oldData = store.readQuery({
    query: Query.getSeries,
    variables: { search: '' }
  });

  const alreadyExists = oldData.series.some((x) => x.id === item.id);

  const series = !alreadyExists
    ? oldData.series.concat([item])
    : oldData.series.map((x) => (x.id !== item.id ? x : item));

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
