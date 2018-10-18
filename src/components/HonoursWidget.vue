<template>
    <section class="honours">
      <header class="honours__header">
        <h4 class="honours__title">Honours</h4>
      </header>
      <LoadingBouncer v-show="isLoading" local />
      <List
        columns="one"
        :items="honoursList"
      >
        <template slot-scope="slotProps">
          <div>{{slotProps.item.key}}</div>
          <div>
            <div>{{slotProps.item.count}}</div>
            <ListFigureCard
              v-show="!isLoading"
              v-bind="slotProps.item"
              :url-source="cardUrl"
            />
          </div>
        </template>
      </List>
    </section>
</template>

<script>
import { ListFigureCard } from '@/components/Cards';
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';

import Urls from '@/constants/urls';
import { Query } from '@/graphql';

export default {
  name: 'HonoursWidget',
  components: {
    ListFigureCard,
    LoadingBouncer,
    List
  },
  data: function() {
    return {
      cardUrl: Urls.characterView,
      honours: {}
    };
  },
  apollo: {
    honours: {
      query: Query.getHonours
    }
  },
  computed: {
    isLoading: function() {
      return this.$apollo.queries.honours.loading;
    },
    honoursList: function() {
      return Object.keys(this.honours).map((key) => ({
        key,
        ...this.honours[key]
      }));
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';
</style>
