<template>
  <div class="page page-view page-view--column league-view">
    <div class="page-view__row page-view__row--right league-view__actions">
      <LoadingBouncer v-show="isLoading" local />
      <Button 
        theme="primary"
        :disabled="!canCreate"
        @click="onMatchCreate">
        Create Matches
      </Button>
    </div>
    <div>
        <!--
            TODO
            Character league table here
        -->
    </div>
  </div>
</template>

<script>
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';
import { Button } from '@/components/Buttons';

import { Query } from '@/graphql';
import * as CacheUpdate from '@/utils/cache';
import * as Routing from '@/utils/routing';

export default {
  name: 'HTRInstanceLeagueView',
  components: {
    List,
    LoadingBouncer,
    Button
  },
  data: function() {
    return {
      mutationLoading: false,
      htrTemplateSeason: {}
    };
  },
  apollo: {
    htrTemplateSeason: {
      query: Query.getHTRTemplateSeasonById,
      variables() {
        const seasonId = Number(Routing.getParam(this.$router, 'seasonId'));
        const leagueId = Routing.getQueryFromLocation('leagueId', null);
        return {
          seasonId,
          leagueId
        };
      }
    }
  },
  computed: {
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    canCreate: function() {
      return false;
    }
  },
  methods: {
    onMatchCreate: function() {
      console.log('%c NOT IMPLEMENTED', 'color: firebrick');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.league-view {
  &__actions {
    position: relative;
  }
}
</style>
