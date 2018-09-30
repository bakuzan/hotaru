import { mapPagedResponseToUpdate } from '@/utils/mappers';

export const size = 8;

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

export const showMore = (ctrl, attr) => {
  const loading = ctrl.$apollo.queries[attr].isLoading;
  const noMore = !ctrl[attr].hasMore;
  console.log('load more', ctrl.page, ctrl[attr]);
  if (noMore || loading) return;

  ctrl.page++;
  ctrl.$apollo.queries[attr].fetchMore({
    variables: {
      ...ctrl.filters,
      paging: {
        page: ctrl.page,
        size
      }
    },
    updateQuery: mapPagedResponseToUpdate
  });
};
