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
    characterCreate(character: CharacterInput): Character
    characterUpdate(character: CharacterInput): Character

    seriesCreate(series: SeriesInput): Series
    seriesUpdate(series: SeriesInput): Series
  }
`;

module.exports = [Query, Mutation];
