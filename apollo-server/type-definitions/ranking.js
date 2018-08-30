const gql = require('graphql-tag');

module.exports = gql`
  type Ranking {
    id: Int!
    total: Int
    wins: Int
    rank: Int
    ratio: Int
    score: Int
  }
`;
