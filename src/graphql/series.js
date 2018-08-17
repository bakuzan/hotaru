import gql from 'graphql-tag';

const allSeries = gql`
  query allSeries {
    series {
      id
      name
    }
  }
`;

const getSeries = gql`
  query getSeries($search: String) {
    series(search: $search) {
      id
      name
    }
  }
`;

const getSeriesById = gql`
  query getSeriesById($id: Int!) {
    seriesById(id: $id) {
      id
      name
      characters {
        id
        name
      }
    }
  }
`;

export default {
  query: {
    allSeries,
    getSeries,
    getSeriesById
  }
};
