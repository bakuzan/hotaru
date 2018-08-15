import gql from 'graphql-tag';

import characters from './characters';

export const Query = {
  ...characters.query
};

export const Mutate = {};
