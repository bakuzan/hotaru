const gql = require('graphql-tag');

module.exports = gql`
  type Series {
    id: Int!
    name: String
    displayImage: String
    source: SourceType
    characters(gender: GenderType): [Character]
  }
  type SeriesPage {
    nodes: [Series]
    total: Int
    hasMore: Boolean
  }
  input SeriesInput {
    id: Int
    name: String
    displayImage: String
    source: SourceType
    characterIds: [Int]
  }
`;
