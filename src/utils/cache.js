import { Query } from '@/graphql';

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

export const refreshCharacterSeriesFragment = (store, rawSeries) => {
  console.log(
    '%c refresh character state post series mutation: not yet implemented',
    'color: red',
    store,
    rawSeries
  );
};
