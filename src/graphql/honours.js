import gql from 'graphql-tag';

const characterFields = gql`
  fragment HonoursCharacterFields on HonoursCharacter {
    id
    name
    displayImage
  }
`;

const getHonours = gql`
  query GetHonours {
    honours {
      mostWinsInLast7 {
        ...HonoursCharacterFields
      }
      mostWinsInLast30 {
        ...HonoursCharacterFields
      }
    }
  }
  ${characterFields}
`;

export default {
  query: {
    getHonours
  }
};
