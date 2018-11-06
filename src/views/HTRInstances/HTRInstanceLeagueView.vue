<template>
  <div class="page page-view page-view--column league-view">
    <div class="page-view__row page-view__row--right league-view__header">
      <LoadingBouncer v-show="isLoading" local />
      <h4 class="league-view__title">
        {{htrTemplateSeasonById && htrTemplateSeasonById.name}}
        {{isSeasonComplete ? 'Complete' : 'Ongoing'}}
      </h4>
      <Button 
        theme="primary"
        :disabled="!canCreate"
        @click="onMatchCreate">
        Create Matches
      </Button>
    </div>
    <div class="page-view__row">
      <section class="league-view-section">
        <SelectBox
          id="league"
          name="league"
          text="League"
          :options="leagueOptions"
          :value="currentLeagueId"
          @on-select="onLeagueChange"
        />
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>P</th>
              <th>W</th>
              <th>L</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="row in leagueCharacters" 
              :key="row.id"
            >
              <td>
                {{row.name}}
                <!-- TODO: Add display image -->
              </td>
              <td>{{row.played}}</td>
              <td>{{row.won}}</td>
              <td>{{row.lost}}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';
import { Button } from '@/components/Buttons';
import SelectBox from '@/components/SelectBox';

import { Query } from '@/graphql';
import Strings from '@/constants/strings';
import * as CacheUpdate from '@/utils/cache';
import * as Routing from '@/utils/routing';
import { mapToSelectBoxOptions } from '@/utils/mappers';

export default {
  name: 'HTRInstanceLeagueView',
  components: {
    List,
    LoadingBouncer,
    Button,
    SelectBox
  },
  data: function() {
    return {
      mutationLoading: false,
      htrTemplateSeasonById: {},
      htrInstanceLeagueById: {}
    };
  },
  apollo: {
    htrTemplateSeasonById: {
      query: Query.getHTRTemplateSeasonById,
      variables() {
        return {
          id: this.seasonId
        };
      }
    },
    htrInstanceLeagueById: {
      query: Query.getHTRInstanceLeagueById,
      skip() {
        return !this.currentLeagueId;
      },
      variables() {
        return {
          id: this.currentLeagueId
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
    },
    seasonId: function() {
      return Number(Routing.getParam(this.$router, 'seasonId'));
    },
    currentLeagueId: function() {
      return Routing.getQueryFromLocation('leagueId', null);
    },
    leagues: function() {
      const leagues =
        this.htrTemplateSeasonById && this.htrTemplateSeasonById.instances;
      if (!leagues) {
        return [];
      }
      return leagues;
    },
    leagueOptions: function() {
      return mapToSelectBoxOptions(this.leagues);
    },
    isSeasonComplete: function() {
      return (
        this.leagues.length && this.leagues.every((x) => x.settings.isComplete)
      );
    },
    leagueCharacters: function() {
      return (
        (this.htrInstanceLeagueById && this.htrInstanceLeagueById.characters) ||
        []
      );
    }
  },
  methods: {
    onMatchCreate: function() {
      console.log('%c NOT IMPLEMENTED', 'color: firebrick');
    },
    onLeagueChange: function(value) {
      const leagueId = Number(value);
      this.$router.replace({
        name: Strings.route.htrInstanceLeagueView,
        query: { leagueId }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.league-view {
  &__header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    margin: 0;
  }
}

.league-view-section {
  display: flex;
  flex-direction: column;
}
</style>
