<template>
  <div class="page">
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

import { Query } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import * as LP from '@/utils/list-pages';

const defaultPage = {
  page: 0,
  size: LP.size
};

export default {
  name: 'HTRInstanceLeagueCenter',
  components: {
    List
  },
  data: function() {
    return {
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
  computed: {},
  methods: {
    showMore: function() {
      LP.showMore(this, 'pastHTRInstanceLeaguesPaged', 'HTRInstanceLeaguePage');
    }
  }
};
</script>
