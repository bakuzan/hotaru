import characters from './characters';
import series from './series';
import tags from './tags';

export const Query = {
  ...characters.query,
  ...series.query,
  ...tags.query
};

export const Mutation = {
  ...characters.mutation
};
