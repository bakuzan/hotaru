<template>
  <div class="home">
    <div class="daily-versus">
      <Button 
        v-if="allowCreateCall"
        theme="primary"
        @click="handleCreateDaily"
      >
        Create versus
      </Button>
      <List 
        className="daily-versus-list"
        itemClassName="daily-versus-list__item"
        :items="versusDailyActive"
      >
        <template slot-scope="slotProps">
          <VersusWidget
            v-bind="slotProps.item"
          />
        </template>
      </List>
    </div>
    <div>
      TOP TEN RANKS PLACEHOLDER
    </div>
  </div>
</template>

<script>
import List from '@/components/List';
import VersusWidget from '@/components/VersusWidget';
import Button from '@/components/Button';

import { Query, Mutation } from '@/graphql';

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
    }
  }
};
</script>
