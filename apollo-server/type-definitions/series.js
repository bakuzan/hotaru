const gql = require('graphql-tag');

module.exports = gql`
  type Series {
    id: Int!
    name: String
    source: SourceType
    characters(gender: GenderType): [Character]
  }
  input SeriesInput {
    id: Int
    name: String
    source: SourceType
    characters: [CharacterInput]
    characterIds: [Int]
  }
`;
