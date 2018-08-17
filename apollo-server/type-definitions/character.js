const gql = require('graphql-tag');

module.exports = gql`
  type Character {
    id: Int!
    name: String
    displayImage: String
    gender: GenderType
    series: Series
    seriesId: Int
  }
  input CharacterInput {
    id: Int
    name: String
    displayImage: String
    gender: GenderType
    seriesId: Int
  }
`;
