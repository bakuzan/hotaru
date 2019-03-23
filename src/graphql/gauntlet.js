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

const getGauntletCharacters = gql`
  query GauntletCharacters(
    $search: String
    $genders: [GenderType]
    $sources: [SourceType]
    $paging: Paging
  ) {
    gauntletCharacters(
      search: $search
      genders: $genders
      sources: $sources
      paging: $paging
    ) {
      nodes {
        id
        name
        displayImage
      }
      total
      hasMore
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
    getActiveGauntlet,
    getGauntletCharacters
  },
  mutation: { createGauntlet }
};
