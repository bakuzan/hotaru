import gql from 'graphql-tag';

import Fragments from './fragments';

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
        ...SeriesBase
      }
      total
      hasMore
    }
  }
  ${Fragments.seriesBase}
`;

const getSeries = gql`
  query getSeries($search: String, $sources: [SourceType]) {
    series(search: $search, sources: $sources) {
      ...SeriesBase
    }
  }
  ${Fragments.seriesBase}
`;

const getSeriesById = gql`
  query getSeriesById($id: Int!) {
    seriesById(id: $id) {
      ...SeriesBase
      source
      characters {
        ...CharacterBase
        seriesId
      }
    }
  }
  ${Fragments.seriesBase}
  ${Fragments.characterBase}
`;

const updateSeries = gql`
  mutation updateSeries($series: SeriesInput) {
    seriesUpdate(series: $series) {
      ...SeriesBase
      source
      characters {
        ...CharacterBase
      }
    }
  }
  ${Fragments.seriesBase}
  ${Fragments.characterBase}
`;

const createSeries = gql`
  mutation createSeries($series: SeriesInput) {
    seriesCreate(series: $series) {
      ...SeriesBase
      source
      characters {
        ...CharacterBase
      }
    }
  }
  ${Fragments.seriesBase}
  ${Fragments.characterBase}
`;

const seriesCore = gql`
  fragment seriesCore on Series {
    name
    displayImage
  }
`;

const checkSeriesAlreadyExists = gql`
  query CheckSeriesAlreadyExists($id: Int, $name: String!) {
    checkSeriesAlreadyExists(id: $id, name: $name)
  }
`;

export default {
  query: {
    allSeries,
    getSeriesPaged,
    getSeries,
    getSeriesById,
    checkSeriesAlreadyExists
  },
  mutation: {
    updateSeries,
    createSeries
  },
  fragment: {
    seriesCore
  }
};
