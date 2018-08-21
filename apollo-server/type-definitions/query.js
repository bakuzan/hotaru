const gql = require('graphql-tag');

const Query = gql`
  type Query {
    characters(search: String): [Character]
    characterById(id: Int!): Character
    characterImages(characterId: Int!): [Image]

    series(search: String): [Series]
    seriesById(id: Int!): Series

    tags(search: String): [Tag]
  }
`;

const Mutation = gql`
  type Mutation {
    characterCreate(character: CharacterInput): Character
    characterUpdate(character: CharacterInput): Character

    seriesCreate(series: SeriesInput): Series
    seriesUpdate(series: SeriesInput): Series

    tagCreate(tag: TagInput): Tag
  }
`;

module.exports = [Query, Mutation];
