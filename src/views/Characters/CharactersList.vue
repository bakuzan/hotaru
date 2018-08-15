<template>
  <div>
    <h1>characters list page</h1>
    <List 
      className="characters"
      itemClassName="characters__item"
      :items="characters"
    >
      <template slot-scope="slotProps">
      {{ slotProps.item.name }}
      </template>
    </List>
  </div>
</template>

<script>
// import classNames from 'classnames';

import List from '@/components/List';

export default {
  name: 'CharactersList',
  components: {
    List
  },
  data: function() {
    return {
      characters: [
        { id: 1, name: 'test' },
        { id: 2, name: 'second' },
        { id: 3, name: 'and another with a long name' }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
