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

export default {
  query: {
    getPastHTRInstanceLeaguesPaged,
    getOngoingHTRInstanceLeagues
  },
  mutation: {
    createHTRInstanceLeague
  }
};
