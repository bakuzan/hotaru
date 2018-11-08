<template>
  <div class="page page-view page-view--column league-view">
    <div class="page-view__row page-view__row--right league-view__header">
      <LoadingBouncer v-show="isLoading" local />
      <h4 class="league-view__title">
        {{htrTemplateSeasonById && htrTemplateSeasonById.name}}
        <span class="status-badge themed-background">
        {{isSeasonComplete ? 'Complete' : 'Ongoing'}}
        </span>
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
        <table class="table league-table">
          <thead>
            <tr>
              <th class="name-column"></th>
              <th>P</th>
              <th>W</th>
              <th>L</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(row, i) in leagueTable" 
              :key="row.id"
              class="league-table__row"
            >
              <td class="name-column">
                <RankingCard 
                  size="small"
                  :rank="i+1"
                  :character="row"
                />
              </td>
              <td class="text--top text--right padded">{{row.played}}</td>
              <td class="text--top text--right padded">{{row.won}}</td>
              <td class="text--top text--right padded">{{row.lost}}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="league-view-section">
        <List 
          columns="one"
          :items="leagueMatches.nodes"
          :paged-total="leagueMatches.total"
          @intersect="showMoreMatches"
        >
          <template slot-scope="slotProps">
            <VersusWidget
              v-bind="slotProps.item"
              enable-compare
              :figure-size="null"
              @vote="handleVote"
            />
          </template>
        </List>
      </section>
    </div>
  </div>
</template>

<script>
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';
import { Button } from '@/components/Buttons';
import SelectBox from '@/components/SelectBox';
import { RankingCard } from '@/components/Cards';
import VersusWidget from '@/components/Widgets/VersusWidget';

import { Query, Mutation } from '@/graphql';
import Strings from '@/constants/strings';
import * as CacheUpdate from '@/utils/cache';
import * as Routing from '@/utils/routing';
import alertService from '@/utils/alert-service';
import { defaultPagedResponse } from '@/utils/models';

export default {
  name: 'HTRInstanceLeagueView',
  components: {
    List,
    LoadingBouncer,
    Button,
    SelectBox,
    RankingCard,
    VersusWidget
  },
  data: function() {
    return {
      mutationLoading: false,
      page: 0,
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
        this.page = 0;
        return {
          id: this.currentLeagueId,
          page: 0
        };
      }
    }
  },
  computed: {
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    canCreate: function() {
      return (
        this.currentLeagueId &&
        !this.isSeasonComplete &&
        (!this.leagueMatches.nodes.length ||
          this.leagueMatches.nodes.every((x) => x.winnerId))
      );
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
      return this.leagues.map((x) => ({
        value: x.id,
        text: `${x.name} (${x.settings.isComplete ? 'Complete' : 'Ongoing'})`
      }));
    },
    isSeasonComplete: function() {
      return (
        this.leagues.length && this.leagues.every((x) => x.settings.isComplete)
      );
    },
    leagueTable: function() {
      return (
        (this.htrInstanceLeagueById &&
          this.htrInstanceLeagueById.leagueTable) ||
        []
      );
    },
    leagueMatches: function() {
      return (
        (this.htrInstanceLeagueById &&
          this.htrInstanceLeagueById.matches &&
          this.htrInstanceLeagueById.matches) ||
        defaultPagedResponse()
      );
    }
  },
  methods: {
    onMatchCreate: function() {
      this.mutationLoading = true;

      this.$apollo
        .mutate({
          mutation: Mutation.createLeagueMatchUps,
          variables: { id: this.currentLeagueId },
          update: (
            store,
            { data: { htrInstanceLeagueVersusCreate: versus } }
          ) => {
            const { htrInstanceLeagueById: league } = store.readQuery({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: this.currentLeagueId }
            });
            console.log('created versus', versus, league);
            league.matches.nodes.unshift(...versus);

            store.writeQuery({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: this.currentLeagueId },
              data: { htrInstanceLeagueById: league }
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
    },
    onLeagueChange: function(value) {
      const leagueId = Number(value);
      this.$router.replace({
        name: Strings.route.htrInstanceLeagueView,
        query: { leagueId }
      });
    },
    handleVote: function(versusId, winnerId) {
      this.mutationLoading = true;

      this.$apollo
        .mutate({
          mutation: Mutation.castVoteInLeague,
          variables: {
            htrInstanceId: this.currentLeagueId,
            versusId,
            winnerId
          },
          update: (store, { data: { htrInstanceLeagueVersusVote } }) => {
            const { htrInstanceLeagueById: league } = store.readQuery({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: this.currentLeagueId }
            });

            const data = {
              ...league,
              ...htrInstanceLeagueVersusVote,
              matches: {
                ...league.matches,
                nodes: league.matches.nodes.map(
                  (x) => (x.id === versusId ? { ...x, winnerId } : x)
                )
              }
            };

            store.writeQuery({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: this.currentLeagueId },
              data: { htrInstanceLeagueById: data }
            });
          }
        })
        .then(() => {
          this.mutationLoading = false;
        })
        .catch((error) => {
          alertService.sendError({
            message: 'Failed to Vote',
            detail: error.message || error
          });
          this.mutationLoading = false;
        });
    },
    showMoreMatches: function() {
      const { matches } = this.htrInstanceLeagueById;
      const query = this.$apollo.queries.htrInstanceLeagueById;
      if (!matches || !matches.hasMore || query.loading) {
        return;
      }

      this.page += 1;
      query.fetchMore({
        variables: {
          id: this.currentLeagueId,
          page: this.page
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const prevData = prevResult.htrInstanceLeagueById;
          const nextData = fetchMoreResult.htrInstanceLeagueById;

          return {
            htrInstanceLeagueById: {
              __typename: 'HTRInstance',
              ...nextData,
              matches: {
                ...nextData.matches,
                nodes: [...prevData.matches.nodes, ...nextData.matches.nodes]
              }
            }
          };
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.status-badge {
  padding: $app--padding-standard;
  border-radius: 1em;
}

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
  width: 50%;
}

.name-column {
  min-width: 100px;
  max-width: 40vw;
  overflow: hidden;
}
</style>
