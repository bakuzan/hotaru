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

const createVersusFromRules = gql`
  mutation createVersusFromRules($rules: VersusRules) {
    versusFromRules(rules: $rules) {
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

const getVersusSingles = gql`
  query versusSinglesNotWon {
    versusSinglesNotWon {
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

export default {
  query: {
    getActiveDailyVersus,
    getVersusHistoryComparison,
    getVersusSingles
  },
  mutation: {
    createDailyVersus,
    createVersusFromRules,
    castVote
  }
};
