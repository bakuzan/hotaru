const gql = require('graphql-tag');

module.exports = gql`
  type RankingPage {
    nodes: [RankedCharacter]
    total: Int
    hasMore: Boolean
  }
  type RankedCharacter {
    id: Int!
    name: String
    displayImage: String
    gender: GenderType
    seriesId: Int
    isWaifu: Boolean
    total: Int
    wins: Int
    rank: Int
    ratio: Float
    score: Float
  }
  type RankingPopulateResponse {
    success: Boolean
    message: String
  }
`;
