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

export default {
  query: {
    getCharacters
  }
};
