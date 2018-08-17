const gql = require('graphql-tag');

module.exports = gql`
  type Character {
    id: Int!
    name: String
    displayImage: String
    gender: GenderType
    series: Series
    seriesId: Int
    tags: [Tag]
    tagIds: [Int]
  }
  input CharacterInput {
    id: Int
    name: String
    displayImage: String
    gender: GenderType
    seriesId: Int
    tagIds: [Int]
  }
`;
