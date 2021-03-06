<template>
  <div class="page page-view">
    <div :class="columnClasses">
      <section class="top-ten htr-section">
        <header class="htr-section__header">
          <h4 class="htr-section__title">Top Ten</h4>
        </header>
        <List
          :items="rankingsTopTen"
          class="top-ten-list"
          item-class-name="top-ten__item"
          columns="one"
        >
          <template slot-scope="slotProps">
            <RankingCard
              v-bind="formatRankCharacter(slotProps.item)"
              :figure-size="null"
            />
          </template>
        </List>
      </section>
    </div>
    <div :class="columnClasses">
      <section class="daily-versus htr-section">
        <header class="htr-section__header">
          <h4 class="htr-section__title">Daily Versus</h4>
          <div class="daily-verus__create">
            <Button
              v-show="allowCreateCall"
              theme="primary"
              @click="handleCreateDaily"
              >Create versus</Button
            >
            <LoadingBouncer v-show="blockCreateVersus" local />
          </div>
        </header>
        <List
          :items="dailyVersus"
          class="daily-versus-list"
          item-class-name="daily-versus-list__item"
          columns="one"
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
    </div>
    <div :class="columnClasses">
      <CharacterOfTheDayWidget />
      <div class="random-container padded padded--standard">
        <Button theme="primary" @click="onRandom">View Random Character</Button>
      </div>
      <HonoursWidget />
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';
import List from '@/components/List';
import VersusWidget from '@/components/Widgets/VersusWidget';
import { RankingCard } from '@/components/Cards';
import { Button } from '@/components/Buttons';
import LoadingBouncer from '@/components/LoadingBouncer';
import CharacterOfTheDayWidget from '@/components/Widgets/CharacterOfTheDayWidget';
import HonoursWidget from '@/components/Widgets/HonoursWidget';

import alertService from '@/utils/alertService';
import Urls from '@/constants/urls';
import { Query, Mutation } from '@/graphql';
import { mapVersusToVotedVersus } from '@/utils/mappers';
import formatForRankingCard from '@/utils/formatForRankingCard';
import { createErrorStringFromGraphql } from '@/utils';

export default {
  name: 'Home',
  components: {
    List,
    VersusWidget,
    RankingCard,
    CharacterOfTheDayWidget,
    Button,
    LoadingBouncer,
    HonoursWidget
  },
  data: function () {
    return {
      cardUrl: Urls.characterView,
      columnClasses: classNames(
        'page-view__left-column htr-column',
        'home-content-column'
      ),
      blockCreateVersus: true,
      versusDailyActive: [],
      rankingsTopTen: []
    };
  },
  metaInfo: {
    title: 'Dashboard | Hotaru'
  },
  apollo: {
    versusDailyActive: {
      query: Query.getActiveDailyVersus,
      result() {
        this.blockCreateVersus = false;
      }
    },
    rankingsTopTen: {
      query: Query.getTopTen,
      fetchPolicy: 'network-only'
    }
  },
  computed: {
    allowCreateCall: function () {
      return (
        !this.blockCreateVersus &&
        (!this.versusDailyActive.length ||
          this.versusDailyActive.every((x) => x.winnerId))
      );
    },
    dailyVersus: function () {
      return [
        ...this.versusDailyActive.filter((x) => !x.winnerId),
        ...this.versusDailyActive.filter((x) => x.winnerId)
      ];
    }
  },
  methods: {
    formatRankCharacter: function (o) {
      return formatForRankingCard(o);
    },
    onRandom: function () {
      this.$apollo
        .query({
          query: Query.getRandomCharacterId,
          fetchPolicy: 'network-only'
        })
        .then(({ data }) => {
          this.$router.push(
            Urls.build(Urls.characterView, { id: data.characterRandom.id })
          );
        })
        .catch((error) =>
          alertService.sendError({
            message: 'Failed to fetch random character',
            detail: createErrorStringFromGraphql(error)
          })
        );
    },
    handleCreateDaily: function () {
      if (!this.allowCreateCall) return;
      this.blockCreateVersus = true;

      this.$apollo
        .mutate({
          mutation: Mutation.createDailyVersus,
          update: (store, { data: { versusCreateDaily } }) => {
            const data = store.readQuery({ query: Query.getActiveDailyVersus });
            data.versusDailyActive.push(...versusCreateDaily);
            store.writeQuery({ query: Query.getActiveDailyVersus, data });
          }
        })
        .then(() => (this.blockCreateVersus = false))
        .catch((error) =>
          alertService.sendError({
            message: 'Failed to create daily versus',
            detail: createErrorStringFromGraphql(error)
          })
        );
    },
    handleVote: function (versusId, winnerId) {
      const versus = this.versusDailyActive.find((x) => x.id === versusId);
      const versusResult = { ...versus, winnerId };

      this.$apollo
        .mutate({
          mutation: Mutation.castVote,
          variables: { versusId, winnerId },
          update: (store, { data: { versusVote } }) => {
            const data = store.readQuery({ query: Query.getActiveDailyVersus });
            const versusDailyActive = data.versusDailyActive.map((x) => {
              return x.id !== versusId
                ? x
                : { ...x, winnerId: versusVote.winnerId };
            });
            store.writeQuery({
              query: Query.getActiveDailyVersus,
              data: { versusDailyActive }
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
@import '../styles/_mixins';

.home-content-column {
  flex-basis: unset;
  width: 30%;

  &:nth-child(2) {
    width: 40%;
  }
}

.htr-section {
  max-width: 100%;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__title {
    margin: $app--margin-standard;
  }
}

.daily-verus__create {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 26px;
}

.random-container {
  @extend %center-contents;
  margin-bottom: $app--margin-large;
}

@include respondTo(sm) {
  .page-view {
    flex-wrap: wrap;

    .home-content-column {
      width: 45%;
      margin: 0 auto;
    }
  }
}
@include respondTo(xs) {
  .page-view {
    flex-direction: column;

    .home-content-column {
      width: 100%;
    }
  }
}
</style>
<style lang="scss" src="../styles/_page-view.scss" />
