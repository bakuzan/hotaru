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
      examples: null,
      filters: {
        search: ''
      },
      characters: [
        { id: 1, name: 'test' },
        { id: 2, name: 'second' },
        { id: 3, name: 'and another with a long name' }
      ]
    };
  },
  apollo: {
    examples: Query.example
  },
  methods: {
    onInput: function(value, name) {
      this.filters[name] = value;

      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        console.log('search!');
      }, 1500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
