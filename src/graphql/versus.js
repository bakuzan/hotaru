import gql from 'graphql-tag';

const getActiveDailyVersus = gql`
  query getActiveDailyVersus {
    activeDailyVersus {
      id
      characters {
        id
        name
        displayImage
      }
      winnerId
    }
  }
`;

export default {
  query: {
    getActiveDailyVersus
  }
};
