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
        createdAt
        updatedAt
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
  query getHTRInstanceLeagueById($id: Int!, $page: Int!) {
    htrInstanceLeagueById(id: $id, page: $page) {
      ...LeagueFields
      leagueTable {
        ...LeagueTableBase
        played
        won
        lost
      }
      matches {
        nodes {
          ...VersusBase
        }
        total
        hasMore
      }
    }
  }
  ${Fragments.leagueInstanceFields}
  ${Fragments.leagueTableBase}
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

const castVoteInLeague = gql`
  mutation castVoteInLeague(
    $htrInstanceId: Int!
    $versusId: Int!
    $winnerId: Int!
  ) {
    htrInstanceLeagueVersusVote(
      htrInstanceId: $htrInstanceId
      versusId: $versusId
      winnerId: $winnerId
    ) {
      ...LeagueFields
      leagueTable {
        ...LeagueTableBase
        played
        won
        lost
      }
    }
  }
  ${Fragments.leagueInstanceFields}
  ${Fragments.leagueTableBase}
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
    createLeagueMatchUps,
    castVoteInLeague
  }
};
