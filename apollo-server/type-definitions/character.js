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
    images: [Image]
    isWaifu: Boolean
  }
  type CharacterPage {
    nodes: [Character]
    total: Int
    hasMore: Boolean
  }
  input CharacterInput {
    id: Int
    name: String
    displayImage: String
    gender: GenderType
    seriesId: Int
    tags: [TagInput]
    tagIds: [Int]
    images: [ImageInput]
    isWaifu: Boolean
  }
`;
