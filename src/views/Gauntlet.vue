<template>
  <div class="page page-view">
    <LoadingBouncer v-if="isLoading"/>
    <section v-if="activeGauntlet.versus.length">
      <header>
        <h4>Gauntlet</h4>
        <div>
          <Button
            v-if="activeGauntlet.canContinue"
            theme="primary"
            :disabled="gauntletDisabled"
            @click="handleContinueGauntlet"
          >Continue Gauntlet</Button>
        </div>
      </header>
      <ListFigureCard
        v-bind="activeGauntlet.character"
        :url-source="cardUrl"
        figureDirection="row"
      />
      <List columns="two" :items="activeGauntlet.versus">
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
    <section v-else-if="!isLoading && activeGauntlet.versus.length === 0">
      <header>
        <h4>Gauntlet Characters</h4>
        <div>Select a character to run the gauntlet.</div>
      </header>
      <div>FILTERS HERE</div>
      <List
        is-grid="standard"
        :items="gauntletCharacters.nodes"
        :paged-total="gauntletCharacters.total"
        @intersect="showMore"
      >
        <template slot-scope="slotProps">
          <ListFigureCard v-bind="slotProps.item" :url-source="cardUrl"/>
          <Button theme="primary" @click="handleCreateGauntlet(slotProps.item.id)">Start Gauntlet</Button>
        </template>
      </List>
    </section>
  </div>
</template>

<script>
// import classNames from 'classnames';
import LoadingBouncer from '@/components/LoadingBouncer';
import List from '@/components/List';
import VersusWidget from '@/components/Widgets/VersusWidget';
import { ListFigureCard } from '@/components/Cards';
import { Button } from '@/components/Buttons';

import alertService from '@/utils/alert-service';
import { Query, Mutation } from '@/graphql';
import Urls from '@/constants/urls';
import { mapVersusToVotedVersus } from '@/utils/mappers';
import { createErrorStringFromGraphql } from '@/utils';
import * as LP from '@/utils/list-pages';

export default {
  name: 'Gauntlet',
  components: {
    LoadingBouncer,
    List,
    VersusWidget,
    ListFigureCard,
    Button
  },
  data: function() {
    return {
      cardUrl: Urls.gauntlet,
      activeGauntlet: {},
      gauntletCharacters: [],
      isLoadingMutation: false
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
        return this.isLoading || this.activeGauntlet.versus.length;
      },
      variables: {
        search: '',
        genders: [],
        sources: [],
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
    gauntletDisabled: function() {
      return !(
        this.activeGauntlet.canContinue &&
        this.activeGauntlet.character &&
        this.activeGauntlet.versus.some((x) => !x.winnerId)
      );
    }
  },
  methods: {
    handleContinueGauntlet: function() {
      this.handleCreateGauntlet(this.activeGauntlet.character.id);
    },
    handleCreateGauntlet: function(characterId) {
      if (!this.isLoadingMutation) {
        return;
      }

      this.isLoadingMutation = true;

      this.$apollo
        .mutate({
          mutation: Mutation.createGauntlet,
          variables: { characterId },
          update: (store, { data: { gauntletCreate } }) => {
            const data = { ...gauntletCreate.data };
            store.writeQuery({ query: Query.getActiveGauntlet, data });
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
      const versus = this.gauntlet.versus.find((x) => x.id === versusId);
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
              query: Query.getActiveDailyVersus,
              data: { ...gauntletData, versus: gauntletVersus }
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
</style>
<style lang="scss" src="../styles/_page-view.scss" />
