import gql from 'graphql-tag';

import Fragments from './fragments';

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
      total
      character {
        id
        name
        displayImage
      }
    }
  }
`;

const getRankingsPaged = gql`
  query getRankingsPaged(
    $search: String
    $genders: [GenderType]
    $sources: [SourceType]
    $series: [Int]
    $paging: Paging
  ) {
    rankingsPaged(
      search: $search
      genders: $genders
      sources: $sources
      series: $series
      paging: $paging
    ) {
      nodes {
        ...CharacterBase
        ranking {
          rank
          wins
          total
        }
        series {
          id
          name
        }
      }
      total
      hasMore
    }
  }
  ${Fragments.characterBase}
`;

export default {
  query: {
    getTopTen,
    getRankingsPaged
  },
  mutation: {
    populateRankings
  }
};
