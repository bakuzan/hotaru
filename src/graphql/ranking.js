import gql from 'graphql-tag';

const populateRankings = gql`
  query populateRankings {
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
    populateRankings,
    getTopTen
  }
};
