import characters from './characters';
import series from './series';
import tags from './tags';
import image from './image';
import versus from './versus';

export const Query = {
  ...characters.query,
  ...series.query,
  ...tags.query,
  ...versus.query
};

export const Mutation = {
  ...characters.mutation,
  ...series.mutation,
  ...image.mutation,
  ...versus.mutation
};
