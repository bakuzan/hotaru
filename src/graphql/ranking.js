import gql from 'graphql-tag';

const getTopTen = gql`
  query getTopTen {
    rankingsTopTen {
      wins
      score
      character {
        id
        name
        displayName
      }
    }
  }
`;

export default {
  query: {
    getTopTen
  }
};
