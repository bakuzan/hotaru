import gql from 'graphql-tag';

const allTags = gql`
  query allTags {
    tags {
      id
      name
    }
  }
`;

const getTags = gql`
  query getTags($search: String) {
    tags(search: $search) {
      id
      name
    }
  }
`;

export default {
  query: {
    allTags,
    getTags
  }
};
