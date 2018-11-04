import gql from 'graphql-tag';

const instanceFields = gql`
  fragment LeagueFields on HTRInstance {
    id
    name
    settings {
      isComplete
      finalMatchDayCount
      layout
    }
  }
`;

const getOngoingHTRInstanceLeagues = gql`
  query getOngoingHTRInstanceLeagues {
    ongoingHTRInstanceLeagues {
      nodes {
        id
        name
        htrInstances {
          ...LeagueFields
        }
      }
    }
  }
  ${instanceFields}
`;

const getPastHTRInstanceLeaguesPaged = gql`
  query getPastHTRInstanceLeaguesPaged($paging: Paging) {
    pastHTRInstanceLeaguesPaged(paging: $paging) {
      nodes {
        id
        name
        htrInstances {
          ...LeagueFields
        }
      }
      total
      hasMore
    }
  }
  ${instanceFields}
`;

export default {
  query: {
    getPastHTRInstanceLeaguesPaged,
    getOngoingHTRInstanceLeagues
  },
  mutation: {}
};
