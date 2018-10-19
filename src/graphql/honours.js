import gql from 'graphql-tag';

const characterFields = gql`
  fragment HonoursCharacterFields on HonoursCharacter {
    key
    id
    name
    displayImage
    count
  }
`;

const getHonours = gql`
  query GetHonours {
    honours {
      mostWinsInLast7Days {
        ...HonoursCharacterFields
      }
      mostWinsInLast30Days {
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
