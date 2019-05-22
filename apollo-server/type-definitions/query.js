const gql = require('graphql-tag');

const Query = gql`
  type Query {
    charactersPaged(
      search: String
      genders: [GenderType]
      sources: [SourceType]
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
    characterCountForTemplateRules(
      search: String
      rules: HTRTemplateRulesInput
    ): Int
    checkCharacterAlreadyExists(id: Int, name: String!, seriesId: Int!): Boolean

    seriesPaged(
      search: String
      sources: [SourceType]
      paging: Paging
    ): SeriesPage
    series(search: String, sources: [SourceType]): [Series]
    seriesById(id: Int!): Series
    checkSeriesAlreadyExists(id: Int, name: String!): Boolean

    tags(search: String): [Tag]

    versusDailyActive: [Versus]
    versusHistoryPaged(characterId: Int!, paging: Paging): VersusPage
    versusHistoryComparison(characterIds: [Int]): VersusComparison
    versusSinglesNotWon: [Versus]

    rankingsTopTen: [RankedCharacter]
    rankingsPaged(
      search: String
      genders: [GenderType]
      sources: [SourceType]
      series: [Int]
      paging: Paging
      fromDate: String
      toDate: String
    ): RankingPage

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
    htrInstanceLeagueById(id: Int!, page: Int): HTRInstance

    gauntletCharacters(
      search: String
      genders: [GenderType]
      sources: [SourceType]
      paging: Paging
    ): CharacterPage
    activeGauntlet: GauntletResponse
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
    htrInstanceLeagueVersusCreate(id: Int!): [Versus]
    htrInstanceLeagueVersusVote(
      htrInstanceId: Int!
      versusId: Int!
      winnerId: Int!
    ): HTRInstance

    gauntletCreate(characterId: Int!): GauntletCreateResponse
  }
`;

module.exports = [Query, Mutation];
