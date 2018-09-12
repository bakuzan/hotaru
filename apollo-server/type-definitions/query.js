const gql = require('graphql-tag');

const Query = gql`
  type Query {
    characters(search: String, genders: [GenderType]): [Character]
    charactersWithoutSeries(search: String): [Character]
    characterById(id: Int!): Character
    characterImages(characterId: Int!): [Image]
    charactersByIds(characterIds: [Int]): [Character]
    characterRandom: Character

    series(search: String, sources: [SourceType]): [Series]
    seriesById(id: Int!): Series

    tags(search: String): [Tag]

    versusDailyActive: [Versus]
    versusHistoryComparison(characterIds: [Int]): [Versus]
    versusSinglesNotWon: [Versus]

    rankingsTopTen: [Ranking]

    htrTemplates(search: String, type: HTRTemplateType!): [HTRTemplate]
    htrTemplateById(id: Int!): HTRTemplate
  }
`;

const Mutation = gql`
  type Mutation {
    characterCreate(character: CharacterInput): Character
    characterUpdate(character: CharacterInput): Character
    characterOfTheDay(onDate: String): Character

    seriesCreate(series: SeriesInput): Series
    seriesUpdate(series: SeriesInput): Series

    tagCreate(tag: TagInput): Tag

    uploadImageBase64(payload: String!): ImageUploadResponse
    uploadImageUrl(payload: String!): ImageUploadResponse

    versusCreateDaily: [Versus]
    versusVote(versusId: Int!, winnerId: Int!): Versus
    versusFromRules(rules: VersusRules): Versus

    populateRankings: RankingPopulateResponse

    htrTemplateCreate(template: HTRTemplateInput): HTRTemplate
    htrTemplateUpdate(template: HTRTemplateUpdateInput): HTRTemplate
  }
`;

module.exports = [Query, Mutation];
