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
      name
      displayImage
      rank
      wins
      total
    }
  }
`;

/*
        series {
          id
          name
        }
 */
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
        id
        name
        displayImage
        rank
        wins
        total
      }
      total
      hasMore
    }
  }
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
