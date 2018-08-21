<template>
  <div class="page">
    <ListFilterBar 
      v-bind="filters"
      @input="onInput"
      @add="onAdd"
    />
    <List 
      className="series"
      itemClassName="series__item"
      :items="series"
    >
      <template slot-scope="slotProps">
        <SeriesCard v-bind="slotProps.item" />
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import ListFilterBar from '@/components/ListFilterBar';
import { SeriesCard } from '@/components/Cards';

import Urls from '@/constants/urls';
import { Query } from '@/graphql';

export default {
  name: 'SeriesList',
  components: {
    List,
    ListFilterBar,
    SeriesCard
  },
  data: function() {
    return {
      searchTimer: null,
      filters: {
        search: ''
      },
      series: []
    };
  },
  apollo: {
    characters: {
      query: Query.getSeries,
      debounce: 1000,
      variables() {
        return { ...this.filters };
      }
    }
  },
  methods: {
    onInput: function(value, name) {
      this.filters[name] = value;
    },
    onAdd: function() {
      this.$router.push(Urls.seriesCreate);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
