const gql = require('graphql-tag');

module.exports = gql`
  type RankingPage {
    nodes: [Character]
    total: Int
    hasMore: Boolean
  }
  type Ranking {
    id: Int!
    total: Int
    wins: Int
    rank: Int
    ratio: Float
    score: Float
    character: Character
  }
  type RankingPopulateResponse {
    success: Boolean
    message: String
  }
`;
