<template>
  <div class="page page-view">
    <div :class="columnClasses">
      <section class="top-ten htr-section">
        <header class="htr-section__header">
          <h4>Top Ten</h4>
        </header>
        <List 
          className="top-ten-list"
          itemClassName="top-ten__item"
          columns="one"
          :items="rankingsTopTen"
        >
          <template slot-scope="slotProps">
            <RankingCard
              v-bind="slotProps.item"
            />
          </template>
        </List>
      </section>
    </div>
    <div :class="columnClasses">
      <section class="daily-versus htr-section">
        <header class="htr-section__header">
          <h4>Daily Versus</h4>
          <Button 
            v-if="allowCreateCall"
            theme="primary"
            @click="handleCreateDaily"
          >
            Create versus
          </Button>
          <LoadingBouncer v-show="blockCreateVersus" />
        </header>
        <List 
          className="daily-versus-list"
          itemClassName="daily-versus-list__item"
          columns="one"
          :items="dailyVersus"
        >
          <template slot-scope="slotProps">
            <VersusWidget
              v-bind="slotProps.item"
              @vote="handleVote"
            />
          </template>
        </List>
      </section>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';
import List from '@/components/List';
import VersusWidget from '@/components/VersusWidget';
import { RankingCard } from '@/components/Cards';
import Button from '@/components/Button';
import LoadingBouncer from '@/components/LoadingBouncer';

import { Query, Mutation } from '@/graphql';
import { mapVersusToVotedVersus } from '@/utils/mappers';

export default {
  name: 'Home',
  components: {
    List,
    VersusWidget,
    RankingCard,
    Button,
    LoadingBouncer
  },
  data: function() {
    return {
      columnClasses: classNames(
        'page-view__left-column page-view__left-column--grow htr-column'
      ),
      blockCreateVersus: true,
      versusDailyActive: [],
      rankingsTopTen: []
    };
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
    handleCreateDaily: function() {
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
            const versusDailyActive = data.versusDailyActive.map(
              (x) =>
                x.id !== versusId ? x : { ...x, winnerId: versusVote.winnerId }
            );
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
.htr-section__header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// use while dashboard is sparse
.top-ten-list {
  margin-left: 30%;
}
</style>
<style lang="scss" src="../styles/_page-view.scss" />
