const gql = require('graphql-tag');

module.exports = gql`
  type Honours {
    mostWinsInLast7Days: HonoursCharacter
    mostWinsInLast30Days: HonoursCharacter
    mostCommonVersus: HonoursVersus
    closestRivalry: HonoursVersus
    longestVersus: HonoursVersus
  }
  type HonoursCharacter {
    key: Int
    id: Int
    name: String
    displayImage: String
    count: Int
  }
  type HonoursVersus {
    key: Int
    fights: Int
    c1Wins: Int
    c2Wins: Int
    cId1: Int
    cId2: Int
    characters: [Character]
    winnerId: Int
    diff: Int
  }
`;
