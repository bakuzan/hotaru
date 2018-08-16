const gql = require('graphql-tag');

module.exports = gql`
  type Series {
    id: Int!
    name: String
    characters(gender: GenderType): [Character]
  }
`;
