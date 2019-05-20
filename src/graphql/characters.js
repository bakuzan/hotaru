import gql from 'graphql-tag';

const charactersQueryFields = gql`
  fragment CharactersQueryFields on Character {
    id
    name
    displayImage
    isWaifu
  }
`;

const characterCreationFields = gql`
  fragment CreationFields on Character {
    id
    name
    displayImage
    isWaifu
    gender
    seriesId
    tags {
      id
      name
    }
  }
`;

const getCharactersPaged = gql`
  query getCharactersPaged(
    $search: String
    $genders: [GenderType]
    $sources: [SourceType]
    $paging: Paging
  ) {
    charactersPaged(
      search: $search
      genders: $genders
      sources: $sources
      paging: $paging
    ) {
      nodes {
        ...CharactersQueryFields
      }
      total
      hasMore
    }
  }
  ${charactersQueryFields}
`;

const getCharacters = gql`
  query getCharacters($search: String, $genders: [GenderType]) {
    characters(search: $search, genders: $genders) {
      ...CharactersQueryFields
    }
  }
  ${charactersQueryFields}
`;

const getCharactersForVersusCompare = gql`
  query getCharactersForVersusCompare($search: String) {
    characters(search: $search) {
      id
      name
      displayImage
    }
  }
`;

const getCharactersWithoutSeries = gql`
  query getCharactersWithoutSeries($search: String) {
    charactersWithoutSeries(search: $search) {
      id
      name
      displayImage
    }
  }
`;

const getCharactersForTemplateRules = gql`
  query getCharactersForTemplateRules(
    $search: String
    $rules: HTRTemplateRulesInput
  ) {
    charactersForTemplateRules(search: $search, rules: $rules) {
      id
      name
      displayImage
    }
  }
`;

const getCharacterCountForTemplateRules = gql`
  query getCharacterCountForTemplateRules(
    $search: String
    $rules: HTRTemplateRulesInput
  ) {
    characterCountForTemplateRules(search: $search, rules: $rules)
  }
`;

const getCharacterById = gql`
  query getCharacterById($id: Int!) {
    characterById(id: $id) {
      ...CharactersQueryFields
      gender
      seriesId
      tagIds
    }
  }
  ${charactersQueryFields}
`;

const getCharactersByIds = gql`
  query getCharactersByIds($characterIds: [Int]) {
    charactersByIds(characterIds: $characterIds) {
      id
      name
      displayImage
    }
  }
`;

const updateCharacter = gql`
  mutation updateCharacter($character: CharacterInput, $withImages: Boolean!) {
    characterUpdate(character: $character) {
      ...CreationFields
      images @include(if: $withImages) {
        id
        url
      }
    }
  }
  ${characterCreationFields}
`;

const createCharacter = gql`
  mutation createCharacter($character: CharacterInput, $withImages: Boolean!) {
    characterCreate(character: $character) {
      ...CreationFields
      images @include(if: $withImages) {
        id
        url
      }
    }
  }
  ${characterCreationFields}
`;

const characterCore = gql`
  fragment characterCore on Character {
    name
    displayImage
  }
`;

const getRandomCharacterId = gql`
  query getRandomCharacterId {
    characterRandom {
      id
    }
  }
`;

const getCharacterOfTheDay = gql`
  mutation getCharacterOfTheDay($onDate: String) {
    characterOfTheDay(onDate: $onDate) {
      id
      name
      displayImage
    }
  }
`;

const checkCharacterAlreadyExists = gql`
  query CheckCharacterAlreadyExists($id: Int, $name: String!, $seriesId: Int!) {
    checkCharacterAlreadyExists(id: $id, name: $name, seriesId: $seriesId)
  }
`;

export default {
  query: {
    getCharactersPaged,
    getCharacters,
    getCharactersForVersusCompare,
    getCharactersWithoutSeries,
    getCharactersForTemplateRules,
    getCharacterCountForTemplateRules,
    getCharacterById,
    getCharactersByIds,
    getRandomCharacterId,
    checkCharacterAlreadyExists
  },
  mutation: {
    updateCharacter,
    createCharacter,
    getCharacterOfTheDay
  },
  fragment: {
    characterCore
  }
};
