import characters from './characters';
import series from './series';
import tags from './tags';
import image from './image';
import versus from './versus';
import ranking from './ranking';

export const Query = {
  ...characters.query,
  ...series.query,
  ...tags.query,
  ...versus.query,
  ...ranking.query
};

export const Mutation = {
  ...characters.mutation,
  ...series.mutation,
  ...image.mutation,
  ...versus.mutation,
  ...ranking.mutation
};

export const Fragment = {
  ...characters.fragment,
  ...series.fragment
};
