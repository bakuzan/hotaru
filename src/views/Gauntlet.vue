<template>
  <div class="page page-view gauntlet">
    <LoadingBouncer v-show="isLoading"/>
    <section v-if="showView" class="gauntlet-view">
      <header class="gauntlet-view__header">
        <h4 class="gauntlet__title">Active Gauntlet</h4>
        <div class="gauntlet-view__actions">
          <Button
            v-if="activeGauntlet.canContinue"
            theme="primary"
            :disabled="gauntletCreateDisabled"
            @click="handleContinueGauntlet"
          >Continue Gauntlet</Button>
          <Button
            theme="primary"
            :disabled="gauntletSelectionDisabled"
            @click="handleReturnToSelection"
          >Go to Gauntlet Selection</Button>
        </div>
      </header>
      <div class="gauntlet-view__active-character">
        <ListFigureCard
          v-bind="activeGauntlet.character"
          :url-source="cardUrl"
          figure-direction="row"
        />
        <div class="gauntlet-view__count-summary">
          <div>Total Versus: {{versusCounts.total}}</div>
          <div>Remaining Versus: {{versusCounts.ongoing}}</div>
        </div>
      </div>
      <List
        :className="'gauntlet-versus-grid'"
        itemClassName="gauntlet-versus-grid__item"
        :is-grid="true"
        :items="activeGauntlet.versus"
      >
        <template slot-scope="slotProps">
          <VersusWidget
            v-bind="slotProps.item"
            enable-compare
            grow
            :figure-size="null"
            @vote="handleVote"
          />
        </template>
      </List>
    </section>
    <section v-else-if="showSelection" class="gauntlet-selection">
      <header>
        <h4 class="gauntlet__title">Gauntlet Characters</h4>
        <div class="gauntlet__subtitle">Select a character to run the gauntlet.</div>
      </header>
      <ListFilterBar v-bind="filters" :hideAdd="true" @input="onInput">
        <MultiSelect
          :slot="typeSlotName"
          id="gender"
          name="genders"
          label="genders"
          :values="filters.genders"
          :options="mappedGenders"
          @update="onInput"
        />
        <MultiSelect
          :slot="typeSlotName"
          id="source"
          name="sources"
          label="sources"
          :values="filters.sources"
          :options="mappedSources"
          @update="onInput"
        />
      </ListFilterBar>
      <List
        is-grid="standard"
        itemClassName="gauntlet-selection-item"
        :items="gauntletCharacters.nodes"
        :paged-total="gauntletCharacters.total"
        @intersect="showMore"
      >
        <template slot-scope="slotProps">
          <ListFigureCard
            class="gauntlet-selection-item__card"
            v-bind="slotProps.item"
            figure-direction="row"
            :url-source="cardUrl"
          />
          <div class="gauntlet-selection-item__actions">
            <Button theme="primary" @click="handleCreateGauntlet(slotProps.item.id)">Start Gauntlet</Button>
          </div>
        </template>
      </List>
    </section>
  </div>
</template>

<script>
import LoadingBouncer from '@/components/LoadingBouncer';
import List from '@/components/List';
import VersusWidget from '@/components/Widgets/VersusWidget';
import { ListFigureCard } from '@/components/Cards';
import { Button } from '@/components/Buttons';
import ListFilterBar from '@/components/ListFilterBar';
import MultiSelect from '@/components/MultiSelect';

import alertService from '@/utils/alert-service';
import { Query, Mutation } from '@/graphql';
import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import GenderType from '@/constants/gender-type';
import SourceType from '@/constants/source-type';
import { createErrorStringFromGraphql } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapVersusToVotedVersus
} from '@/utils/mappers';
import { defaultPagedResponse } from '@/utils/models';
import * as LP from '@/utils/list-pages';

export default {
  name: 'Gauntlet',
  components: {
    LoadingBouncer,
    List,
    VersusWidget,
    ListFigureCard,
    Button,
    ListFilterBar,
    MultiSelect
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType,
      cardUrl: Urls.characterView,
      mappedGenders: mapEnumToSelectBoxOptions(GenderType),
      mappedSources: mapEnumToSelectBoxOptions(SourceType),
      filterHandler: LP.updateFilterAndRefetch(this, 'gauntletCharacters'),
      activeGauntlet: {},
      gauntletCharacters: defaultPagedResponse(),
      isLoadingMutation: false,
      filters: {
        search: '',
        genders: [...GenderType],
        sources: [...SourceType]
      }
    };
  },
  metaInfo: {
    title: 'Hotaru - Gauntlet'
  },
  apollo: {
    activeGauntlet: {
      query: Query.getActiveGauntlet,
      fetchPolicy: 'network-only'
    },
    gauntletCharacters: {
      query: Query.getGauntletCharacters,
      skip() {
        return (
          this.isLoading ||
          (this.activeGauntlet && this.activeGauntlet.versus.length)
        );
      },
      variables: {
        search: '',
        genders: [...GenderType],
        sources: [...SourceType],
        paging: {
          page: 0,
          size: LP.size
        }
      }
    }
  },
  computed: {
    isLoading: function() {
      return (
        this.$apollo.queries.activeGauntlet.loading || this.isLoadingMutation
      );
    },
    showView: function() {
      return (
        this.activeGauntlet &&
        this.activeGauntlet.versus &&
        this.activeGauntlet.versus.length
      );
    },
    showSelection: function() {
      return (
        !this.isLoading &&
        this.activeGauntlet &&
        this.activeGauntlet.versus &&
        this.activeGauntlet.versus.length === 0
      );
    },
    gauntletCreateDisabled: function() {
      if (!this.activeGauntlet.canContinue) {
        return false;
      }

      return (
        !this.activeGauntlet.character ||
        (this.activeGauntlet.versus &&
          this.activeGauntlet.versus.some((x) => !x.winnerId))
      );
    },
    gauntletSelectionDisabled: function() {
      return (
        this.activeGauntlet.versus &&
        this.activeGauntlet.versus.some((x) => !x.winnerId)
      );
    },
    versusCounts: function() {
      if (!this.activeGauntlet.versus) {
        return {
          ongoing: 0,
          total: 0
        };
      }

      const total = this.activeGauntlet.versus.length;
      const ongoing = this.activeGauntlet.versus.filter((x) => !x.winnerId)
        .length;

      return {
        ongoing,
        total
      };
    }
  },
  methods: {
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(this, 'gauntletCharacters', 'CharacterPage');
    },
    handleReturnToSelection: function() {
      this.$apollo.queries.activeGauntlet.refetch();
      this.$apollo.queries.gauntletCharacters.refetch({
        paging: {
          page: 0,
          size: LP.size
        }
      });
    },
    handleContinueGauntlet: function() {
      const character = this.activeGauntlet.character;
      if (!character) {
        console.error(
          'handleContinueGauntlet: Character is not defined, cannot create gauntlet.'
        );
        return;
      }

      this.handleCreateGauntlet(character.id);
    },
    handleCreateGauntlet: function(characterId) {
      if (this.isLoadingMutation) {
        return;
      }

      this.isLoadingMutation = true;

      this.$apollo
        .mutate({
          mutation: Mutation.createGauntlet,
          variables: { characterId },
          update: (store, { data: { gauntletCreate } }) => {
            const activeGauntlet = { ...gauntletCreate.data };
            store.writeQuery({
              query: Query.getActiveGauntlet,
              data: { activeGauntlet }
            });
          }
        })
        .then(() => (this.isLoadingMutation = false))
        .catch((error) =>
          alertService.sendError({
            message: 'Failed to create gauntlet',
            detail: createErrorStringFromGraphql(error)
          })
        );
    },
    handleVote: function(versusId, winnerId) {
      const versus = this.activeGauntlet.versus.find((x) => x.id === versusId);
      const versusResult = { ...versus, winnerId };

      this.$apollo
        .mutate({
          mutation: Mutation.castVote,
          variables: { versusId, winnerId },
          update: (store, { data: { versusVote } }) => {
            const data = store.readQuery({ query: Query.getActiveGauntlet });
            const gauntletData = data.activeGauntlet;
            const gauntletVersus = gauntletData.versus.map((x) => {
              return x.id !== versusId
                ? x
                : { ...x, winnerId: versusVote.winnerId };
            });

            store.writeQuery({
              query: Query.getActiveGauntlet,
              data: {
                activeGauntlet: { ...gauntletData, versus: gauntletVersus }
              }
            });
          },
          optimisticUpdate: mapVersusToVotedVersus(versusResult)
        })
        .then(() => null)
        .catch((error) =>
          alertService.sendError({
            message: 'Failed to process vote',
            detail: createErrorStringFromGraphql(error)
          })
        );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';
@import '../styles/_extensions';

.gauntlet {
  &__title {
    margin: 0;
  }
  &__subtitle {
    font-size: 0.8em;
  }

  &-view {
    width: 100%;

    &__header {
      display: flex;
      justify-content: space-between;
    }

    &__active-character {
      display: flex;
    }
    &__count-summary {
      padding: 15px 0;
    }

    &__actions {
      display: flex;

      // Dont do this!
      > .button {
        margin: 0 5px;
      }
    }
  }
  &-selection {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}

.gauntlet-selection-item {
  &__card {
    height: auto;
  }
  &__actions {
    margin: 0 8px;
  }
}
</style>
<style lang="scss">
@import '../styles/_variables';
@import '../styles/_mixins';

.gauntlet-view__active-character {
  .list-figure-card__link {
    height: min-content;
  }
}
.gauntlet-versus-grid {
  justify-content: space-between;
  grid-gap: 1px;
  grid-auto-rows: auto !important;
  $grid-values: (
    xs: 100,
    sm: 49,
    md: 32,
    lg: 24
  );
  @include gridColumnGenerator($grid-values);
  &__item {
    min-width: 200px;
    .versus {
      height: 100%;
    }
  }
}
.gauntlet-selection-item__card {
  // Dont do this
  .list-figure-card__caption {
    justify-content: flex-start;
    text-align: left;
  }
}
</style>
<style lang="scss" src="../styles/_page-view.scss" />
