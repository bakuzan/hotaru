<template>
  <div class="page page-view">
    <div class="page-view__left-column htr-column">
      <section class="top-ten htr-section">
        <header class="htr-section__header">
          <h4>Top Ten</h4>
        </header>
      </section>
    </div>
    <div class="page-view__left-column htr-column">
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
        </header>
        <List 
          className="daily-versus-list"
          itemClassName="daily-versus-list__item"
          :items="versusDailyActive"
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
import List from '@/components/List';
import VersusWidget from '@/components/VersusWidget';
import Button from '@/components/Button';

import { Query, Mutation } from '@/graphql';
import { mapVersusToVotedVersus } from '@/utils/mappers';

export default {
  name: 'Home',
  components: {
    List,
    VersusWidget,
    Button
  },
  data: function() {
    return {
      allowCreateCall: false,
      versusDailyActive: []
    };
  },
  apollo: {
    versusDailyActive: {
      query: Query.getActiveDailyVersus,
      result({ data }) {
        this.allowCreateCall =
          !data || !data.versusDailyActive || !data.versusDailyActive.length;
      }
    }
  },
  methods: {
    handleCreateDaily: function() {
      this.allowCreateCall = false;
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
</style>
<style lang="scss" src="../styles/_page-view.scss" />
