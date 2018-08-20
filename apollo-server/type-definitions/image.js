const gql = require('graphql-tag');

module.exports = gql`
  type Image {
    id: Int!
    url: String
  }
  input ImageInput {
    url: String
  }
`;
