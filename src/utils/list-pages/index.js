import * as Routing from '../routing';
import { mapPagedResponseToUpdate } from '@/utils/mappers';

export const size = 10;

function getResolvedQueryParam(ctrl, options) {
  if (!options.queryParam) {
    return {};
  }

  return {
    [options.queryParam]: Routing.getQueryArg(
      ctrl.$router,
      options.queryParam,
      options.queryDefault
    )
  };
}

export const updateFilterAndRefetch = (ctrl, attr, options = {}) => (
  value,
  name
) => {
  updateFilter(ctrl, value, name, options);
  refetchForFilter(ctrl, attr, options);
};

export const updateFilter = (ctrl, value, name, options = {}) => {
  if (options.queryParam !== name) {
    ctrl.filters[name] = value;
  } else {
    ctrl.$router.replace({
      name: ctrl.$router.history.current.name,
      query: { [name]: value }
    });
  }
};

export const refetchForFilter = (ctrl, attr, options = {}) => {
  const resolvedQueryParam = getResolvedQueryParam(ctrl, options);

  clearTimeout(ctrl.searchTimer);
  ctrl.searchTimer = setTimeout(() => {
    ctrl.$apollo.queries[attr].refetch({
      ...ctrl.filters,
      ...resolvedQueryParam,
      paging: {
        page: 0,
        size
      }
    });
  }, 1000);
};

export const showMore = (ctrl, attr, typename, options = {}) => {
  const query = ctrl.$apollo.queries[attr];
  const loading = query && query.loading;
  const noMore = !ctrl[attr].hasMore;

  if (noMore || loading) {
    return;
  }

  const resolvedQueryParam = getResolvedQueryParam(ctrl, options);
  const items = ctrl.$apolloData.data[attr].nodes;
  const page = Math.ceil(items.length / size);

  query.fetchMore({
    variables: {
      ...ctrl.filters,
      ...resolvedQueryParam,
      paging: {
        page: page || 1,
        size
      }
    },
    updateQuery: mapPagedResponseToUpdate(typename)
  });
};
