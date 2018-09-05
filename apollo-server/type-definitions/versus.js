const gql = require('graphql-tag');

module.exports = gql`
  type Versus {
    id: Int!
    type: VersusType
    characters: [Character]
    winner: Character
    winnerId: Int
    updatedAt: String
  }
`;
