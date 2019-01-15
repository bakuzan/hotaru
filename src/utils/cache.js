import { Query, Fragment } from '@/graphql';

import { mapMutationToListStore } from '@/utils/mappers';

export const isLoading = (apollo, only = []) => {
  const { queries } = apollo;
  const keys = Object.keys(queries);
  const watching = only.length ? keys.filter((x) => only.includes(x)) : keys;
  return watching.some((k) => queries[k].loading);
};

const updateFragment = (fragment) => (store, rawItem) => {
  const { id, name, displayImage, __typename } = mapMutationToListStore(
    rawItem
  );

  store.writeFragment({
    id,
    fragment,
    data: { name, displayImage, __typename }
  });
};
export const refreshCharacter = updateFragment(Fragment.characterCore);
export const refreshSeries = updateFragment(Fragment.seriesCore);

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
