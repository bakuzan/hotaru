<template>
  <div class="page page-view gauntlet">
    <LoadingBouncer v-show="isLoading" />
    <section v-if="showView" class="gauntlet-view">
      <header class="gauntlet-view__header">
        <h4 class="gauntlet__title">Active Gauntlet</h4>
        <div class="gauntlet-view__actions">
          <Button
            v-if="activeGauntlet.canContinue"
            :disabled="gauntletCreateDisabled"
            theme="primary"
            @click="handleContinueGauntlet"
            >Continue Gauntlet</Button
          >
          <Button
            :disabled="gauntletSelectionDisabled"
            theme="primary"
            @click="handleReturnToSelection"
            >Go to Gauntlet Selection</Button
          >
        </div>
      </header>
      <div class="gauntlet-view__active-character">
        <ListFigureCard
          v-bind="activeGauntlet.character"
          :url-source="cardUrl"
          figure-direction="row"
        />
        <div class="gauntlet-view__count-summary">
          <div>Total Versus: {{ versusCounts.total }}</div>
          <div>Remaining Versus: {{ versusCounts.ongoing }}</div>
        </div>
      </div>
      <List
        :class-name="'gauntlet-versus-grid'"
        :is-grid="true"
        :items="activeGauntlet.versus"
        item-class-name="gauntlet-versus-grid__item"
      >
        <template slot-scope="slotProps">
          <VersusWidget
            v-bind="slotProps.item"
            :figure-size="null"
            enable-compare
            grow
            @vote="handleVote"
          />
        </template>
      </List>
    </section>
    <section v-else-if="showSelection" class="gauntlet-selection">
      <header>
        <h4 class="gauntlet__title">Gauntlet Characters</h4>
        <div class="gauntlet__subtitle">
          Select a character to run the gauntlet.
        </div>
      </header>
      <ListFilterBar v-bind="filters" :hide-add="true" @input="onInput">
        <MultiSelect
          id="gender"
          :slot="typeSlotName"
          :values="filters.genders"
          :options="mappedGenders"
          name="genders"
          label="genders"
          @update="onInput"
        />
        <MultiSelect
          id="source"
          :slot="typeSlotName"
          :values="filters.sources"
          :options="mappedSources"
          name="sources"
          label="sources"
          @update="onInput"
        />
      </ListFilterBar>
      <List
        :items="gauntletCharacters.nodes"
        :paged-total="gauntletCharacters.total"
        is-grid="standard"
        item-class-name="gauntlet-selection-item"
        @intersect="showMore"
      >
        <template slot-scope="slotProps">
          <ListFigureCard
            v-bind="slotProps.item"
            :url-source="cardUrl"
            class="gauntlet-selection-item__card"
            figure-direction="row"
          />
          <div class="gauntlet-selection-item__actions">
            <Button
              theme="primary"
              @click="handleCreateGauntlet(slotProps.item.id)"
              >Start Gauntlet</Button
            >
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

import alertService from '@/utils/alertService';
import { Query, Mutation } from '@/graphql';
import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import GenderType from '@/constants/genderType';
import SourceType from '@/constants/sourceType';
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
  data: function () {
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
    title: 'Gauntlet | Hotaru'
  },
  apollo: {
    activeGauntlet: {
      query: Query.getActiveGauntlet,
      fetchPolicy: 'network-only'
    },
    gauntletCharacters: {
      query: Query.getGauntletCharacters,
      fetchPolicy: 'network-only',
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
    isLoading: function () {
      return (
        this.$apollo.queries.activeGauntlet.loading || this.isLoadingMutation
      );
    },
    showView: function () {
      return (
        this.activeGauntlet &&
        this.activeGauntlet.versus &&
        this.activeGauntlet.versus.length
      );
    },
    showSelection: function () {
      return (
        !this.isLoading &&
        this.activeGauntlet &&
        this.activeGauntlet.versus &&
        this.activeGauntlet.versus.length === 0
      );
    },
    gauntletCreateDisabled: function () {
      if (!this.activeGauntlet.canContinue) {
        return false;
      }

      return (
        !this.activeGauntlet.character ||
        (this.activeGauntlet.versus &&
          this.activeGauntlet.versus.some((x) => !x.winnerId))
      );
    },
    gauntletSelectionDisabled: function () {
      return (
        this.activeGauntlet.versus &&
        this.activeGauntlet.versus.some((x) => !x.winnerId)
      );
    },
    versusCounts: function () {
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
    onInput: function (value, name) {
      this.filterHandler(value, name);
    },
    showMore: function () {
      LP.showMore(this, 'gauntletCharacters', 'CharacterPage');
    },
    handleReturnToSelection: function () {
      this.$apollo.queries.activeGauntlet.refetch();
      this.$apollo.queries.gauntletCharacters.refetch({
        paging: {
          page: 0,
          size: LP.size
        }
      });
    },
    handleContinueGauntlet: function () {
      const character = this.activeGauntlet.character;
      if (!character) {
        console.error(
          'handleContinueGauntlet: Character is not defined, cannot create gauntlet.'
        );
        return;
      }

      this.handleCreateGauntlet(character.id);
    },
    handleCreateGauntlet: function (characterId) {
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
    handleVote: function (versusId, winnerId) {
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

.gauntlet-view__active-character .list-figure-card__link {
  height: min-content;
}

.gauntlet-versus-grid {
  gap: 5px 30px;
  grid-auto-rows: auto !important;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  padding: 0;

  &__item .versus {
    height: 100%;
  }
}

// Dont do this
.gauntlet-selection-item__card .list-figure-card__caption {
  justify-content: flex-start;
  text-align: left;
}
</style>
<style lang="scss" src="../styles/_page-view.scss" />
