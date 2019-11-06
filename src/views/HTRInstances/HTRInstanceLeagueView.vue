<template>
  <div class="page page-view page-view--column league-view">
    <div class="page-view__row page-view__row--right league-view__header">
      <LoadingBouncer v-show="isLoading" local />
      <h4 class="league-view__title">
        {{ htrTemplateSeasonById && htrTemplateSeasonById.name }}
        <span class="status-badge themed-background">
          {{ isSeasonComplete ? 'Complete' : 'Ongoing' }}
        </span>
      </h4>
      <Button :disabled="!canCreate" theme="primary" @click="onMatchCreate"
        >Create Matches</Button
      >
    </div>
    <div class="page-view__row page-view__row--responsive">
      <section class="league-view-section">
        <SelectBox
          id="league"
          :options="leagueOptions"
          :value="currentLeagueId()"
          name="league"
          text="League"
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
                <RankingCard :rank="i + 1" :character="row" size="small" />
              </td>
              <td class="text--top text--right padded">{{ row.played }}</td>
              <td class="text--top text--right padded">{{ row.won }}</td>
              <td class="text--top text--right padded">{{ row.lost }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="league-view-section">
        <List
          :items="leagueMatches.nodes"
          :paged-total="leagueMatches.total"
          columns="one"
          @intersect="showMoreMatches"
        >
          <template slot-scope="slotProps">
            <VersusWidget
              v-bind="slotProps.item"
              :figure-size="null"
              enable-compare
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
import alertService from '@/utils/alertService';
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
      title: '',
      mutationLoading: false,
      page: 0,
      htrTemplateSeasonById: {},
      htrInstanceLeagueById: {}
    };
  },
  metaInfo() {
    this.updateTitle();
    return {
      title: this.title,
      titleTemplate: `View League - %s | Hotaru`
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
    htrInstanceLeagueById() {
      const id = Routing.getQueryFromLocation('leagueId', 0);
      return {
        query: Query.getHTRInstanceLeagueById,
        variables: {
          id,
          page: 0
        }
      };
    }
  },
  computed: {
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    canCreate: function() {
      return (
        !this.isSeasonComplete &&
        this.htrInstanceLeagueById &&
        this.htrInstanceLeagueById.settings &&
        !this.htrInstanceLeagueById.settings.isComplete &&
        (!this.leagueMatches.nodes.length ||
          this.leagueMatches.nodes.every((x) => x.winnerId))
      );
    },
    seasonId: function() {
      return Number(Routing.getParam(this.$router, 'seasonId'));
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
  watch: {
    $route: function() {
      const id = Routing.getQueryArg(this.$router, 'leagueId');
      this.updateTitle();
      if (!id) {
        return;
      }

      this.page = 0;
      this.$apollo.queries.htrInstanceLeagueById.refetch({
        id,
        page: 0
      });
    }
  },
  methods: {
    currentLeagueId: function() {
      return Number(Routing.getQueryArg(this.$router, 'leagueId', 0));
    },
    updateTitle: function() {
      const id = this.currentLeagueId();
      const league = this.leagues.find((x) => x.id === id);
      const seasonName =
        this.htrTemplateSeasonById && this.htrTemplateSeasonById.name;
      const leagueName = league && league.name;
      this.title = seasonName + (leagueName ? `, ${leagueName}` : '');
    },
    onMatchCreate: function() {
      this.mutationLoading = true;

      const currentLeagueId = Number(
        Routing.getQueryArg(this.$router, 'leagueId', 0)
      );

      this.$apollo
        .mutate({
          mutation: Mutation.createLeagueMatchUps,
          variables: { id: currentLeagueId },
          update: (
            store,
            { data: { htrInstanceLeagueVersusCreate: versus } }
          ) => {
            const { htrInstanceLeagueById: league } = store.readQuery({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: currentLeagueId, page: 0 }
            });

            const nodes = league.matches.nodes;
            if (nodes.length) {
              this.page = this.page + 1;
            }
            nodes.unshift(...versus);

            store.writeQuery({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: currentLeagueId, page: 0 },
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

      const currentLeagueId = Number(
        Routing.getQueryArg(this.$router, 'leagueId', 0)
      );

      this.$apollo
        .mutate({
          mutation: Mutation.castVoteInLeague,
          variables: {
            htrInstanceId: currentLeagueId,
            versusId,
            winnerId
          },
          update: (store, { data: { htrInstanceLeagueVersusVote } }) => {
            const { htrInstanceLeagueById: league } = store.readQuerySafeHTR({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: currentLeagueId, page: 0 }
            });

            const data = {
              ...league,
              ...htrInstanceLeagueVersusVote,
              matches: {
                ...league.matches,
                nodes: league.matches.nodes.map((x) => {
                  return x.id === versusId ? { ...x, winnerId } : x;
                })
              }
            };

            store.writeQuery({
              query: Query.getHTRInstanceLeagueById,
              variables: { id: currentLeagueId, page: 0 },
              data: { htrInstanceLeagueById: data }
            });

            const res = htrInstanceLeagueVersusVote;
            const isComplete = res.settings && res.settings.isComplete;

            if (isComplete) {
              store.deleteQueryHTR([
                'ongoingHTRInstanceLeagues',
                'pastHTRInstanceLeaguesPaged'
              ]);
            }
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

      const currentLeagueId = Number(
        Routing.getQueryArg(this.$router, 'leagueId', 0)
      );
      this.page += 1;
      query.fetchMore({
        variables: {
          id: currentLeagueId,
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
@import '../../styles/_mixins';

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

  @include respondTo(xs) {
    width: 100%;
  }
}

.name-column {
  min-width: 100px;
  max-width: 40vw;
  overflow: hidden;
}
</style>
