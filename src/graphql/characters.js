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
    }
  }
`;

export default {
  query: {
    getCharacters,
    getCharacterById
  },
  mutation: {
    updateCharacter
  }
};
