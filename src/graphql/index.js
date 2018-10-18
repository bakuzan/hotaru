import characters from './characters';
import series from './series';
import tags from './tags';
import image from './image';
import versus from './versus';
import ranking from './ranking';
import htrTemplate from './htr-template';
import htrInstance from './htr-instance';
import honours from './honours';

export const Query = {
  ...characters.query,
  ...series.query,
  ...tags.query,
  ...versus.query,
  ...ranking.query,
  ...htrTemplate.query,
  ...htrInstance.query,
  ...image.query,
  ...honours.query
};

export const Mutation = {
  ...characters.mutation,
  ...series.mutation,
  ...image.mutation,
  ...versus.mutation,
  ...ranking.mutation,
  ...htrTemplate.mutation,
  ...htrInstance.mutation
};

export const Fragment = {
  ...characters.fragment,
  ...series.fragment
};
