const gql = require('graphql-tag');

module.exports = gql`
  type Tag {
    id: Int!
    name: String
  }
  input TagInput {
    id: Int
    name: String
  }
`;
