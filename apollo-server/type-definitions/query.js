const gql = require('graphql-tag');

const Query = gql`
  type Query {
    charactersPaged(
      search: String
      genders: [GenderType]
      paging: Paging
    ): CharacterPage
    characters(search: String, genders: [GenderType]): [Character]
    charactersWithoutSeries(search: String): [Character]
    characterById(id: Int!): Character
    characterImages(characterId: Int!): [Image]
    charactersByIds(characterIds: [Int]): [Character]
    characterRandom: Character
    charactersForTemplateRules(
      search: String
      rules: HTRTemplateRulesInput
    ): [Character]

    seriesPaged(
      search: String
      sources: [SourceType]
      paging: Paging
    ): SeriesPage
    series(search: String, sources: [SourceType]): [Series]
    seriesById(id: Int!): Series

    tags(search: String): [Tag]

    versusDailyActive: [Versus]
    versusHistoryPaged(characterId: Int!, paging: Paging): VersusPage
    versusHistoryComparison(characterIds: [Int]): [Versus]
    versusSinglesNotWon: [Versus]

    rankingsTopTen: [Ranking]

    htrTemplatesPaged(
      search: String
      type: HTRTemplateType!
      paging: Paging
    ): HTRTemplatePage
    htrTemplates(search: String, type: HTRTemplateType!): [HTRTemplate]
    htrTemplateById(id: Int!): HTRTemplate

    htrInstancesPaged(
      search: String
      type: HTRTemplateType!
      paging: Paging
    ): HTRInstancePage
    htrInstanceById(id: Int!): HTRInstance

    honours: Honours

    ongoingHTRInstanceLeagues: HTRTemplate
    pastHTRInstanceLeaguesPaged(paging: Paging): HTRTemplatePage
    htrTemplateSeasonById(id: Int!): HTRTemplate
    htrInstanceLeagueById(id: Int!): HTRInstance
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

    htrInstanceCreate(instance: HTRInstanceInput): HTRInstance
    htrInstanceUpdate(instance: HTRInstanceInput): HTRInstance
    htrInstanceVersusVote(
      htrInstanceId: Int!
      versusId: Int!
      winnerId: Int!
    ): HTRInstance

    htrInstanceLeagueCreate: HTRTemplate
  }
`;

module.exports = [Query, Mutation];
