const gql = require('graphql-tag');

module.exports = gql`
  type Honours {
    mostWinsInLast7Days: HonoursCharacter
    mostWinsInLast30Days: HonoursCharacter
  }
  type HonoursCharacter {
    key: Int
    id: Int
    name: String
    displayImage: String
    count: Int
  }
`;
