const gql = require('graphql-tag');

module.exports = gql`
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
