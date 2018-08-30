import gql from 'graphql-tag';

const getCharacters = gql`
  query getCharacters($search: String, $genders: [GenderType]) {
    characters(search: $search, genders: $genders) {
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

const getCharacterById = gql`
  query getCharacterById($id: Int!) {
    characterById(id: $id) {
      id
      name
      displayImage
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

const updateCharacter = gql`
  mutation updateCharacter($character: CharacterInput) {
    characterUpdate(character: $character) {
      id
      name
      displayImage
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
  }
`;

const createCharacter = gql`
  mutation createCharacter($character: CharacterInput) {
    characterCreate(character: $character) {
      id
      name
      displayImage
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
  }
`;

export default {
  query: {
    getCharacters,
    getCharactersWithoutSeries,
    getCharacterById
  },
  mutation: {
    updateCharacter,
    createCharacter
  }
};
