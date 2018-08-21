import gql from 'graphql-tag';

const getCharacters = gql`
  query getCharacters($search: String) {
    characters(search: $search) {
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
      series {
        id
        name
      }
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
      series {
        id
        name
      }
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
