<template>
  <div class="versus">
    <ListFigureCard 
      v-for="item in characters"
      v-bind="item" 
      :key="item.id"
      :url-source="characterCardUrl"
      open-new-tab
    />
    <div class="versus__actions">
      VOTE BUTTONS HERE
    </div>
  </div>
</template>

<script>
import { ListFigureCard } from '@/components/Cards';

import Urls from '@/constants/urls';

export default {
  name: 'VersusWidget',
  components: {
    ListFigureCard
  },
  props: {
    characters: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      characterCardUrl: Urls.characterView
    };
  },
  computed: {}
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';
</style>
