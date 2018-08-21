import characters from './characters';
import series from './series';
import tags from './tags';
import image from './image';

export const Query = {
  ...characters.query,
  ...series.query,
  ...tags.query
};

export const Mutation = {
  ...characters.mutation,
  ...series.mutation,
  ...image.mutation
};
