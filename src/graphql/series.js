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
  query getSeries($search: String, $sources: [SourceType]) {
    series(search: $search, sources: $sources) {
      id
      name
      displayImage
    }
  }
`;

const getSeriesById = gql`
  query getSeriesById($id: Int!) {
    seriesById(id: $id) {
      id
      name
      displayImage
      source
      characters {
        id
        name
        displayImage
        seriesId
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
      displayImage
      characters {
        id
        name
        displayImage
      }
    }
  }
`;

const createSeries = gql`
  mutation createSeries($series: SeriesInput) {
    seriesCreate(series: $series) {
      id
      name
      source
      displayImage
      characters {
        id
        name
        displayImage
      }
    }
  }
`;

const seriesCore = gql`
  fragment seriesCore on Series {
    name
    displayImage
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
  },
  fragment: {
    seriesCore
  }
};
