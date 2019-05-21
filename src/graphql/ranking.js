import gql from 'graphql-tag';

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
  }
};
