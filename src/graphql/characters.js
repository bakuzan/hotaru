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

const getCharacter = gql`
  query getCharacter($id: Int!) {
    characterById(id: $id) {
      id
      name
      displayImage
      gender
      series {
        id
        name
      }
    }
  }
`;

export default {
  query: {
    getCharacters,
    getCharacter
  }
};
