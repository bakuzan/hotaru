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
  type VersusPage {
    nodes: [Versus]
    total: Int
    hasMore: Boolean
  }
  type VersusComparison {
    headToHead: [Versus]
    sharedOpponents: [SharedOpponentsVersus]
  }
  type SharedOpponentsVersus {
    keyCharacterId: Int
    characterId: Int
    name: String
    displayImage: String
    winnerId: Int
  }
  input VersusRules {
    genders: [GenderType]
    isIncludeOnlyGender: Boolean
    isIncludeOnlySeries: Boolean
    isIncludeOnlySource: Boolean
    hasNoVersusOnly: Boolean
    series: [Int]
    sources: [SourceType]
  }
`;
