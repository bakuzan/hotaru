import gql from 'graphql-tag';

import Fragments from './fragments';

const getOngoingHTRInstanceLeagues = gql`
  query getOngoingHTRInstanceLeagues {
    ongoingHTRInstanceLeagues {
      ...OngoingLeagueFields
    }
  }
  ${Fragments.ongoingLeagueFields}
`;

const getPastHTRInstanceLeaguesPaged = gql`
  query getPastHTRInstanceLeaguesPaged($paging: Paging) {
    pastHTRInstanceLeaguesPaged(paging: $paging) {
      nodes {
        id
        name
      }
      total
      hasMore
    }
  }
`;

const createHTRInstanceLeague = gql`
  mutation createHTRInstanceLeague {
    htrInstanceLeagueCreate {
      ...OngoingLeagueFields
    }
  }
  ${Fragments.ongoingLeagueFields}
`;

const getHTRTemplateSeasonById = gql`
  query getHTRTemplateSeasonById($id: Int!) {
    htrTemplateSeasonById(id: $id) {
      ...OngoingLeagueFields
    }
  }
  ${Fragments.ongoingLeagueFields}
`;

const getHTRInstanceLeagueById = gql`
  query getHTRInstanceLeagueById($id: Int!) {
    htrInstanceLeagueById(id: $id) {
      ...LeagueFields
      characters {
        ...CharacterBase
      }
      versus {
        ...VersusBase
      }
    }
  }
  ${Fragments.leagueInstanceFields}
  ${Fragments.characterBase}
  ${Fragments.versusBase}
`;

const createLeagueMatchUps = gql`
  mutation createLeagueMatchUps($id: Int!) {
    htrInstanceLeagueVersusCreate(id: $id) {
      id
      characters {
        ...CharacterBase
      }
      winnerId
    }
  }
  ${Fragments.characterBase}
`;

export default {
  query: {
    getPastHTRInstanceLeaguesPaged,
    getOngoingHTRInstanceLeagues,
    getHTRTemplateSeasonById,
    getHTRInstanceLeagueById
  },
  mutation: {
    createHTRInstanceLeague,
    createLeagueMatchUps
  }
};
