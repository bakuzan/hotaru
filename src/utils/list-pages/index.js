import { mapPagedResponseToUpdate } from '@/utils/mappers';

export const size = 10;

export const updateFilterAndRefetch = (ctrl, attr) => (value, name) => {
  ctrl.filters[name] = value;
  ctrl.page = 0;

  clearTimeout(ctrl.searchTimer);
  ctrl.searchTimer = setTimeout(() => {
    ctrl.$apollo.queries[attr].refetch({
      ...ctrl.filters,
      paging: {
        page: ctrl.page,
        size
      }
    });
  }, 1000);
};

export const showMore = (ctrl, attr, typename) => {
  const query = ctrl.$apollo.queries[attr];
  console.log('showMore', query, attr);
  const loading = query && query.loading;
  const noMore = !ctrl[attr].hasMore;

  if (noMore || loading) return;
  console.log('next page', ctrl.page, ctrl.filters);
  ctrl.page++;
  query.fetchMore({
    variables: {
      ...ctrl.filters,
      paging: {
        page: ctrl.page,
        size
      }
    },
    updateQuery: mapPagedResponseToUpdate(typename)
  });
};
