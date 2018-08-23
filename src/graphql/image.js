import gql from 'graphql-tag';

const uploadImageUrl = gql`
  mutation uploadImageUrl($payload: String!) {
    uploadImageUrl(payload: $payload) {
      success
      url
    }
  }
`;

const uploadImageBase64 = gql`
  mutation uploadImageBase64($payload: String!) {
    uploadImageBase64(payload: $payload) {
      success
      url
    }
  }
`;

export default {
  mutation: {
    uploadImageUrl,
    uploadImageBase64
  }
};
