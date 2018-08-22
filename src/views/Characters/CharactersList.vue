<template>
  <div class="page">
    <ListFilterBar 
      v-bind="filters"
      @input="onInput"
      @add="onAdd"
    />
    <List 
      className="characters"
      itemClassName="characters__item"
      :items="characters"
    >
      <template slot-scope="slotProps">
        <ListFigureCard 
          v-bind="slotProps.item" 
          :url-source="cardUrl" 
        />
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import ListFilterBar from '@/components/ListFilterBar';
import { ListFigureCard } from '@/components/Cards';

import Urls from '@/constants/urls';
import { Query } from '@/graphql';

export default {
  name: 'CharactersList',
  components: {
    List,
    ListFilterBar,
    ListFigureCard
  },
  data: function() {
    return {
      cardUrl: Urls.characterView,
      searchTimer: null,
      filters: {
        search: ''
      },
      characters: []
    };
  },
  apollo: {
    characters: {
      query: Query.getCharacters,
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
      this.$router.push(Urls.characterCreate);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
