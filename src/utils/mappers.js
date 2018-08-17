export const mapToSelectBoxOptions = (arr) =>
  arr.map((x) => ({ value: x.id, text: x.name }));

export const mapCharacterToPost = (character) => {
  const { id, name, gender, displayImage, seriesId } = character;
  return {
    id,
    name,
    gender,
    displayImage,
    seriesId
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
