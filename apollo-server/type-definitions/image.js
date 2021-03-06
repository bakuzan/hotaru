const gql = require('graphql-tag');

module.exports = gql`
  type Image {
    id: Int!
    url: String
  }
  input ImageInput {
    id: Int
    url: String
  }
  type ImageUploadResponse {
    success: Boolean
    url: String
  }
`;
