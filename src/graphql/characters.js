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

const getCharacterById = gql`
  query getCharacterById($id: Int!) {
    characterById(id: $id) {
      id
      name
      displayImage
      gender
      seriesId
      tagIds
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
    }
  }
`;

export default {
  query: {
    getCharacters,
    getCharacterById
  },
  mutation: {
    updateCharacter,
    createCharacter
  }
};
