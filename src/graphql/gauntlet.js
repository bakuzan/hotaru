import gql from 'graphql-tag';

const getActiveGauntlet = gql`
  query ActiveGauntlet {
    activeGauntlet {
      canContinue
      character {
        id
        name
        displayImage
      }
      versus {
        id
        characters {
          id
          name
          displayImage
        }
        winnerId
      }
    }
  }
`;

const createGauntlet = gql`
  mutation GauntletCreate($characterId: Int!) {
    gauntletCreate(characterId: $characterId) {
      success
      errorMessages
      data {
        canContinue
        character {
          id
          name
          displayImage
        }
        versus {
          id
          characters {
            id
            name
            displayImage
          }
          winnerId
        }
      }
    }
  }
`;

export default {
  query: {
    getActiveGauntlet
  },
  mutation: { createGauntlet }
};
