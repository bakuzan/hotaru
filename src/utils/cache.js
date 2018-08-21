import { Query } from '@/graphql';

export const refreshAllTags = (store, character) => {
  const oldData = store.readQuery({
    query: Query.allTags
  });
  const newTags = character.tags.filter(
    (x) => !oldData.allTags.some((y) => y.id === x.id)
  );
  const tagData = oldData.allTags.concat([...newTags]);

  store.writeQuery({
    query: Query.allTags,
    data: tagData
  });
};
