import gql from 'graphql-tag';

export const Query = {
  example: gql`
    query Example {
      examples {
        text
      }
    }
  `
};

export const Mutate = {};
