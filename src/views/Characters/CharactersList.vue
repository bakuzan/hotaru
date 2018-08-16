<template>
  <div class="page">
    <InputBox 
      label="search characters"
      :value="filters.search" 
      @input="onInput" 
    />
    <List 
      className="characters"
      itemClassName="characters__item"
      :items="characters"
    >
      <template slot-scope="slotProps">
        <CharacterCard v-bind="slotProps.item" />
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import InputBox from '@/components/InputBox';
import CharacterCard from '@/components/CharacterCard';

import { Query } from '@/graphql';

export default {
  name: 'CharactersList',
  components: {
    List,
    InputBox,
    CharacterCard
  },
  data: function() {
    return {
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
