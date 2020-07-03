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
      score
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
    $fromDate: String
    $toDate: String
  ) {
    rankingsPaged(
      search: $search
      genders: $genders
      sources: $sources
      series: $series
      paging: $paging
      fromDate: $fromDate
      toDate: $toDate
    ) {
      nodes {
        id
        name
        displayImage
        rank
        wins
        total
        score
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
