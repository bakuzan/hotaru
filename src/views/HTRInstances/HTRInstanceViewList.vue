<template>
  <div class="instance-view">
    <List 
      columns="one"
      :items="items"
    >
      <template slot-scope="slotProps">
        <ListFigureCard 
          v-bind="slotProps.item" 
          :url-source="cardUrl" 
          :remove="handleRemove"
        />
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import { ListFigureCard } from '@/components/Cards';

import Urls from '@/constants/urls';

export default {
  name: 'HTRInstanceViewList',
  components: {
    List,
    ListFigureCard
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      cardUrl: Urls.characterView
    };
  },
  computed: {},
  methods: {
    handleRemove: function(characterId) {
      this.$emit('remove', characterId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';
</style>
