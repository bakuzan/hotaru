const gql = require('graphql-tag');

const Query = gql`
  type Query {
    characters(search: String): [Character]
    characterById(id: Int!): Character

    series(search: String): [Series]
    seriesById(id: Int!): Series
  }
`;

const Mutation = gql`
  type Mutation {
    characterCreate(
      name: String
      displayImage: String
      gender: GenderType
      seriesId: Int
    ): Character

    characterUpdate(
      id: Int!
      name: String
      displayImage: String
      gender: GenderType
      seriesId: Int
    ): Character

    seriesCreate(name: String): Series
    seriesUpdate(id: Int!, name: String): Series
  }
`;

module.exports = [Query, Mutation];
