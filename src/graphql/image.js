import gql from 'graphql-tag';

const uploadImageUrl = gql`
  mutation uploadImageUrl($payload: String!) {
    uploadImageUrl(payload: $payload) {
      success
      data
    }
  }
`;

const uploadImageBase64 = gql`
  mutation uploadImageBase64($payload: String!) {
    uploadImageBase64(series: $payload) {
      success
      data
    }
  }
`;

export default {
  mutation: {
    uploadImageUrl,
    uploadImageBase64
  }
};
