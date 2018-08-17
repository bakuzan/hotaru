import characters from './characters';
import series from './series';

export const Query = {
  ...characters.query,
  ...series.query
};

export const Mutation = {
  ...characters.mutation
};
