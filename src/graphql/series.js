import gql from 'graphql-tag';

const seriesQueryFields = gql`
  fragment SeriesQueryFields on Series {
    id
    name
    displayImage
  }
`;

const allSeries = gql`
  query allSeries {
    series {
      id
      name
    }
  }
`;

const getSeriesPaged = gql`
  query getSeriesPaged(
    $search: String
    $sources: [SourceType]
    $paging: Paging
  ) {
    seriesPaged(search: $search, sources: $sources, paging: $paging) {
      nodes {
        ...SeriesQueryFields
      }
      total
      hasMore
    }
  }
  ${seriesQueryFields}
`;

const getSeries = gql`
  query getSeries($search: String, $sources: [SourceType]) {
    series(search: $search, sources: $sources) {
      ...SeriesQueryFields
    }
  }
  ${seriesQueryFields}
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
    getSeriesPaged,
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
