<template>
  <div class="versus">
    <VersusCard 
      v-for="item in characters"
      :key="item.id"
      :item="item"
      :winner-id="winnerId"
      @vote="handleVote"
    />
  </div>
</template>

<script>
import { VersusCard } from '@/components/Cards';

export default {
  name: 'VersusWidget',
  components: {
    VersusCard
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    characters: {
      type: Array,
      default: () => []
    },
    winnerId: {
      type: Number,
      default: null
    }
  },
  methods: {
    handleVote: function(characterId) {
      console.log(
        `For versus ${this.id}, make character ${characterId} the winner`
      );
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';
</style>
