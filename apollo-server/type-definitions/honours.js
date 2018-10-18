const gql = require('graphql-tag');

module.exports = gql`
  type Honours {
    mostWinsInLast7: HonoursCharacter
    mostWinsInLast30: HonoursCharacter
  }
  type HonoursCharacter {
    id: Int
    name: String
    displayImage: String
    count: Int
  }
`;
