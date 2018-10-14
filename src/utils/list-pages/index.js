import * as Routing from '../routing';
import { mapPagedResponseToUpdate } from '@/utils/mappers';

export const size = 10;

export const updateFilterAndRefetch = (ctrl, attr, options = {}) => (
  value,
  name
) => {
  let resolvedQueryParam = {};

  if (options.queryParam !== name) {
    ctrl.filters[name] = value;
  } else {
    ctrl.$router.replace({
      name: ctrl.$router.history.current.name,
      query: { [name]: value }
    });
  }

  if (options.queryParam) {
    resolvedQueryParam =
      Routing.getQuery(ctrl.$router, options.queryParam) ||
      options.queryDefault;
  }

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

export const showMore = (ctrl, attr, typename) => {
  const query = ctrl.$apollo.queries[attr];
  const loading = query && query.loading;
  const noMore = !ctrl[attr].hasMore;

  if (noMore || loading) return;

  const items = ctrl.$apolloData.data[attr].nodes;
  const page = Math.ceil(items.length / size);

  query.fetchMore({
    variables: {
      ...ctrl.filters,
      paging: {
        page: page || 1,
        size
      }
    },
    updateQuery: mapPagedResponseToUpdate(typename)
  });
};
