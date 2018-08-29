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
      this.$emit('vote', this.id, characterId);
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.versus {
  position: relative;
  display: flex;

  &::after {
    content: 'VS';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    transform: translateY(-50%) translateX(-50%);
    border-radius: 50px;
    text-align: center;
  }
}
</style>
