<template>
  <div class="page page-view page-view--column league-center">
    <div class="page-view__row page-view__row--right league-center__actions">
      <LoadingBouncer v-show="isLoading" local />
      <Button 
        theme="primary"
        :disabled="!canCreate"
        @click="onCreateNew">
        Create
      </Button>
    </div>
    <div class="page-view__row league-center__content">
      <section class="league-center__section league-section">
        <h4 class="league-section__header">Ongoing</h4>
        <p class="league-section__sub-header">
          <NavLink class="league-section__season-link" :to="leagueLink(null)">
            {{ongoingHTRInstanceLeagues ? ongoingHTRInstanceLeagues.name : 'No ongoing leagues.'}}
          </NavLink>
        </p>
        <List 
          align-left
          fixed-width
          columns="one"
          :items="ongoingInstances"
        >
          <template slot-scope="slotProps">
            <div class="league-card">
              <div 
                :class="iconClasses(slotProps.item)" 
                :title="`Is ${slotProps.item.settings.isComplete ? 'Complete' : 'Ongoing'}`"
              >
              </div>
              <NavLink class="league-card__text" :to="leagueLink(slotProps.item)">
                {{slotProps.item.name}}
              </NavLink>
            </div>
          </template>
        </List>
      </section>
      <section class="league-center__section">
        <List 
          align-left
          fixed-width
          columns="one"
          :items="pastHTRInstanceLeaguesPaged.nodes"
          :paged-total="pastHTRInstanceLeaguesPaged.total"
          @intersect="showMore"
        >
          <template slot-scope="slotProps">
            <Button @click="onSeasonClick(slotProps.item)">
              {{slotProps.item.name}}
            </Button>
          </template>
        </List>
      </section>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';
import { Button } from '@/components/Buttons';
import NavLink from '@/components/NavLink';

import { Query, Mutation } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import Urls from '@/constants/urls';
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
    Button,
    NavLink
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
    },
    ongoingInstances: function() {
      return (
        (this.ongoingHTRInstanceLeagues &&
          this.ongoingHTRInstanceLeagues.instances) ||
        []
      );
    }
  },
  methods: {
    iconClasses: function(item) {
      return classNames('league-card__icon', {
        'league-card__icon--complete': item.settings.isComplete
      });
    },
    seasonLink: function(seasonId) {
      return Urls.build(Urls.htrInstanceLeagueView, { seasonId });
    },
    leagueLink: function(item) {
      const seasonId =
        this.ongoingHTRInstanceLeagues && this.ongoingHTRInstanceLeagues.id;
      if (!seasonId) {
        return '';
      }

      const url = this.seasonLink(seasonId);
      return item ? `${url}?leagueId=${item.id}` : url;
    },
    onSeasonClick: function(item) {
      // TODO, get season leagues as a sub item.
      console.log('season click > ', item);
    },
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

<style lang="scss" scoped>
@import '../../styles/_variables';

.league-center {
  &__actions {
    position: relative;
  }

  &__section {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: $app--padding-small;
  }
}

.league-section {
  &__header,
  &__sub-header {
    margin: $app--margin-small;
  }

  &__season-link {
    display: flex;
    justify-content: flex-start;
    width: min-content;
    height: auto;
    font-size: 1em;
    white-space: nowrap;
  }
}

.league-card {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &__icon {
    font-size: 1.5em;

    &::before {
      content: '\2610';
    }

    &--complete {
      &::before {
        content: '\2611';
        color: #0f0;
      }
    }
  }
  &__text {
    height: auto;
    font-size: 1em;
  }
}
</style>
