import gql from 'graphql-tag';

const getActiveDailyVersus = gql`
  query getActiveDailyVersus {
    versusDailyActive {
      id
      characters {
        id
        name
        displayImage
      }
      winnerId
    }
  }
`;

const createDailyVersus = gql`
  mutation createDailyVersus {
    versusCreateDaily {
      id
      characters {
        id
        name
        displayImage
      }
      winnerId
    }
  }
`;

const castVote = gql`
  mutation voteForCharacter($versusId: Int!, $winnerId: Int!) {
    versusVote(versusId: $versusId, winnerId: $winnerId) {
      id
      characters {
        id
        name
        displayImage
      }
      winnerId
    }
  }
`;

const getVersusHistoryComparison = gql`
  query getVersusHistoryComparison($characterIds: [Int]) {
    versusHistoryComparison(characterIds: $characterIds) {
      id
      winnerId
      updatedAt
    }
  }
`;

export default {
  query: {
    getActiveDailyVersus,
    getVersusHistoryComparison
  },
  mutation: {
    createDailyVersus,
    castVote
  }
};
