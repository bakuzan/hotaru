<template>
  <div class="page page-view">
    <div :class="columnClasses">
      <section class="top-ten htr-section">
        <header class="htr-section__header">
          <h4 class="htr-section__title">Top Ten</h4>
        </header>
        <List
          class="top-ten-list"
          itemClassName="top-ten__item"
          columns="one"
          :items="rankingsTopTen"
        >
          <template slot-scope="slotProps">
            <RankingCard v-bind="slotProps.item" :figure-size="null"/>
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
            >Create versus</Button>
            <LoadingBouncer v-show="blockCreateVersus" local/>
          </div>
        </header>
        <List
          class="daily-versus-list"
          itemClassName="daily-versus-list__item"
          columns="one"
          :items="dailyVersus"
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
    </div>
    <div :class="columnClasses">
      <CharacterOfTheDayWidget/>
      <div class="random-container padded padded--standard">
        <Button theme="primary" @click="onRandom">View Random Character</Button>
      </div>
      <HonoursWidget/>
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

import Urls from '@/constants/urls';
import { Query, Mutation } from '@/graphql';
import { mapVersusToVotedVersus } from '@/utils/mappers';

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
  data: function() {
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
    title: 'Hotaru - Dashboard'
  },
  apollo: {
    versusDailyActive: {
      query: Query.getActiveDailyVersus,
      result() {
        this.blockCreateVersus = false;
      }
    },
    rankingsTopTen: {
      query: Query.getTopTen
    }
  },
  computed: {
    allowCreateCall: function() {
      return (
        !this.blockCreateVersus &&
        (!this.versusDailyActive.length ||
          this.versusDailyActive.every((x) => x.winnerId))
      );
    },
    dailyVersus: function() {
      return [
        ...this.versusDailyActive.filter((x) => !x.winnerId),
        ...this.versusDailyActive.filter((x) => x.winnerId)
      ];
    }
  },
  methods: {
    onRandom: function() {
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
        .catch((error) => {
          console.log('get random failed', error);
        });
    },
    handleCreateDaily: function() {
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
        .then((data) => {
          console.log(data);
          this.blockCreateVersus = false;
        })
        .catch((error) => {
          console.log('failed to create', error);
        });
    },
    handleVote: function(versusId, winnerId) {
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
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log('failed to create', error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';
@import '../styles/_extensions';

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
</style>
<style lang="scss" src="../styles/_page-view.scss" />
