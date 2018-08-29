const gql = require('graphql-tag');

const Query = gql`
  type Query {
    characters(search: String, genders: [GenderType]): [Character]
    characterById(id: Int!): Character
    characterImages(characterId: Int!): [Image]

    series(search: String, sources: [SourceType]): [Series]
    seriesById(id: Int!): Series

    tags(search: String): [Tag]

    versusDailyActive: [Versus]
  }
`;

const Mutation = gql`
  type Mutation {
    characterCreate(character: CharacterInput): Character
    characterUpdate(character: CharacterInput): Character

    seriesCreate(series: SeriesInput): Series
    seriesUpdate(series: SeriesInput): Series

    tagCreate(tag: TagInput): Tag

    uploadImageBase64(payload: String!): ImageUploadResponse
    uploadImageUrl(payload: String!): ImageUploadResponse

    versusCreateDaily: [Versus]
  }
`;

module.exports = [Query, Mutation];
