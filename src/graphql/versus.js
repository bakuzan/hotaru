import gql from 'graphql-tag';

import Fragments from './fragments';

const getActiveDailyVersus = gql`
  query getActiveDailyVersus {
    versusDailyActive {
      ...VersusBase
    }
  }
  ${Fragments.versusBase}
`;

const createDailyVersus = gql`
  mutation createDailyVersus {
    versusCreateDaily {
      ...VersusBase
    }
  }
  ${Fragments.versusBase}
`;

const createVersusFromRules = gql`
  mutation createVersusFromRules($rules: VersusRules) {
    versusFromRules(rules: $rules) {
      ...VersusBase
    }
  }
  ${Fragments.versusBase}
`;

const castVote = gql`
  mutation voteForCharacter($versusId: Int!, $winnerId: Int!) {
    versusVote(versusId: $versusId, winnerId: $winnerId) {
      ...VersusBase
    }
  }
  ${Fragments.versusBase}
`;

const getVersusHistoryComparison = gql`
  query getVersusHistoryComparison($characterIds: [Int]) {
    versusHistoryComparison(characterIds: $characterIds) {
      headToHead {
        id
        type
        winnerId
        updatedAt
      }
      sharedOpponents {
        keyCharacterId
        characterId
        name
        displayImage
        winnerId
      }
    }
  }
`;

const getVersusSingles = gql`
  query versusSinglesNotWon {
    versusSinglesNotWon {
      ...VersusBase
    }
  }
  ${Fragments.versusBase}
`;

const getVersusHistory = gql`
  query getVersusHistory($characterId: Int!, $paging: Paging) {
    versusHistoryPaged(characterId: $characterId, paging: $paging) {
      nodes {
        ...VersusBase
        type
        updatedAt
      }
      total
      hasMore
    }
  }
  ${Fragments.versusBase}
`;

export default {
  query: {
    getActiveDailyVersus,
    getVersusHistory,
    getVersusHistoryComparison,
    getVersusSingles
  },
  mutation: {
    createDailyVersus,
    createVersusFromRules,
    castVote
  }
};
