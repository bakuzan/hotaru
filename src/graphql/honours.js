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

const versusFields = gql`
  fragment HonoursVersusFields on HonoursVersus {
    key
    c1Wins
    c2Wins
    cId1
    cId2
    characters {
      id
      name
      displayImage
    }
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
      mostCommonVersus {
        ...HonoursVersusFields
        fights
      }
      closestRivalry {
        ...HonoursVersusFields
        fights
      }
      longestVersus {
        ...HonoursVersusFields
        diff
        winnerId
      }
    }
  }
  ${characterFields}
  ${versusFields}
`;

export default {
  query: {
    getHonours
  }
};
