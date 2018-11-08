const gql = require('graphql-tag');

module.exports = gql`
  type LeagueCharacter {
    id: Int!
    name: String
    displayImage: String
    played: Int
    won: Int
    lost: Int
  }
`;
