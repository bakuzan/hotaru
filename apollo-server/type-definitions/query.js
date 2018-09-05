const gql = require('graphql-tag');

const Query = gql`
  type Query {
    characters(search: String, genders: [GenderType]): [Character]
    charactersWithoutSeries(search: String): [Character]
    characterById(id: Int!): Character
    characterImages(characterId: Int!): [Image]
    charactersByIds(characterIds: [Int]): [Character]

    series(search: String, sources: [SourceType]): [Series]
    seriesById(id: Int!): Series

    tags(search: String): [Tag]

    versusDailyActive: [Versus]
    versusHistoryComparison(characterIds: [Int]): [Versus]

    rankingsTopTen: [Ranking]
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
    versusVote(versusId: Int!, winnerId: Int!): Versus

    populateRankings: RankingPopulateResponse
  }
`;

module.exports = [Query, Mutation];
