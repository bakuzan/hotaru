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
      source
      characters {
        id
        name
      }
    }
  }
`;

const updateSeries = gql`
  mutation updateSeries($series: SeriesInput) {
    seriesUpdate(series: $series) {
      id
      name
      source
    }
  }
`;

const createSeries = gql`
  mutation createSeries($series: SeriesInput) {
    seriesCreate(series: $series) {
      id
      name
      source
    }
  }
`;

export default {
  query: {
    allSeries,
    getSeries,
    getSeriesById
  },
  mutation: {
    updateSeries,
    createSeries
  }
};
