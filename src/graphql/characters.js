import gql from 'graphql-tag';

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
    images {
      id
      url
    }
  }
`;

const getCharacters = gql`
  query getCharacters($search: String, $genders: [GenderType]) {
    characters(search: $search, genders: $genders) {
      id
      name
      displayImage
      isWaifu
    }
  }
`;

const getCharactersForVersusCompare = gql`
  query getCharactersForVersusCompare($search: String) {
    characters(search: $search) {
      id
      name
      displayImage
      isWaifu
      ranking {
        rank
      }
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
      ranking {
        rank
      }
    }
  }
`;

const getCharacterById = gql`
  query getCharacterById($id: Int!) {
    characterById(id: $id) {
      id
      name
      displayImage
      isWaifu
      gender
      seriesId
      tagIds
      images {
        id
        url
      }
    }
  }
`;

const getCharactersByIds = gql`
  query getCharactersByIds($characterIds: [Int]) {
    charactersByIds(characterIds: $characterIds) {
      id
      name
      displayImage
      ranking {
        rank
      }
    }
  }
`;

const updateCharacter = gql`
  mutation updateCharacter($character: CharacterInput) {
    characterUpdate(character: $character) {
      ...CreationFields
    }
  }
  ${characterCreationFields}
`;

const createCharacter = gql`
  mutation createCharacter($character: CharacterInput) {
    characterCreate(character: $character) {
      ...CreationFields
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

export default {
  query: {
    getCharacters,
    getCharactersForVersusCompare,
    getCharactersWithoutSeries,
    getCharactersForTemplateRules,
    getCharacterById,
    getCharactersByIds,
    getRandomCharacterId
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
