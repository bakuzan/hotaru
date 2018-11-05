<template>
  <div class="page">
    <LoadingBouncer v-show="isLoading" />

    <div>
      <Button 
        :disabled="!canCreate"
        @click="onCreateNew">
        Create
      </Button>
    </div>
    <List 
      align-left
      fixed-width
      columns="one"
      :items="pastHTRInstanceLeaguesPaged.nodes"
      :paged-total="pastHTRInstanceLeaguesPaged.total"
      @intersect="showMore"
    >
      <template slot-scope="slotProps">
        {{slotProps.item}}
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';
import { Button } from '@/components/Buttons';

import { Query, Mutation } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import * as LP from '@/utils/list-pages';
import * as CacheUpdate from '@/utils/cache';
import alertService from '@/utils/alert-service';

const defaultPage = {
  page: 0,
  size: LP.size
};

export default {
  name: 'HTRInstanceLeagueCenter',
  components: {
    List,
    LoadingBouncer,
    Button
  },
  data: function() {
    return {
      mutationLoading: false,
      searchTimer: null,
      ongoingHTRInstanceLeagues: {},
      pastHTRInstanceLeaguesPaged: defaultPagedResponse()
    };
  },
  watch: {
    $route: function() {
      LP.refetchForFilter(this, 'pastHTRInstanceLeaguesPaged');
    }
  },
  apollo: {
    ongoingHTRInstanceLeagues: {
      query: Query.getOngoingHTRInstanceLeagues
    },
    pastHTRInstanceLeaguesPaged: {
      query: Query.getPastHTRInstanceLeaguesPaged,
      variables: {
        paging: defaultPage
      }
    }
  },
  computed: {
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    canCreate: function() {
      return !this.ongoingHTRInstanceLeagues;
    }
  },
  methods: {
    showMore: function() {
      LP.showMore(this, 'pastHTRInstanceLeaguesPaged', 'HTRInstanceLeaguePage');
    },
    onCreateNew: function() {
      this.mutationLoading = true;

      this.$apollo
        .mutate({
          mutation: Mutation.createHTRInstanceLeague,
          update: (store, { data: { htrInstanceLeagueCreate } }) => {
            store.writeQuery({
              query: Query.getOngoingHTRInstanceLeagues,
              data: {
                ongoingHTRInstanceLeagues: htrInstanceLeagueCreate
              }
            });
          }
        })
        .then(() => {
          this.mutationLoading = false;
        })
        .catch((error) => {
          alertService.sendError({
            message: 'Failed to Create',
            detail: error.message || error
          });
          this.mutationLoading = false;
        });
    }
  }
};
</script>
