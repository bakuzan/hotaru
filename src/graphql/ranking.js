import gql from 'graphql-tag';

const populateRankings = gql`
  mutation populateRankings {
    populateRankings {
      success
      message
    }
  }
`;

const getTopTen = gql`
  query getTopTen {
    rankingsTopTen {
      id
      rank
      wins
      score
      character {
        id
        name
        displayImage
      }
    }
  }
`;

export default {
  query: {
    getTopTen
  },
  mutation: {
    populateRankings
  }
};
