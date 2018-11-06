import gql from 'graphql-tag';

const instanceFields = gql`
  fragment LeagueFields on HTRInstance {
    id
    name
    settings {
      isComplete
      limit
      layout
    }
  }
`;
const ongoingLeagueFields = gql`
  fragment OngoingLeagueFields on HTRTemplate {
    id
    name
    instances {
      ...LeagueFields
    }
  }
  ${instanceFields}
`;

const getOngoingHTRInstanceLeagues = gql`
  query getOngoingHTRInstanceLeagues {
    ongoingHTRInstanceLeagues {
      ...OngoingLeagueFields
    }
  }
  ${ongoingLeagueFields}
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
  ${ongoingLeagueFields}
`;

const getHTRTemplateSeasonById = gql`
  query getHTRTemplateSeasonById($seasonId: Int!, $leagueIds: [Int]) {
    htrTemplateSeasonById(seasonId: $seasonId) {
      id
      name
    }
    htrInstanceLeagues(filter: { leagueIds: $leagueIds }) {
      ...LeagueFields
      characters {
        id
        name
        displayImage
      }
    }
  }
  ${instanceFields}
`;

export default {
  query: {
    getPastHTRInstanceLeaguesPaged,
    getOngoingHTRInstanceLeagues,
    getHTRTemplateSeasonById
  },
  mutation: {
    createHTRInstanceLeague
  }
};
