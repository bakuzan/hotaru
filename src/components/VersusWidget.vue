<template>
  <div class="versus">
    <VersusCard 
      v-for="item in characters"
      :key="item.id"
      :item="item"
      :winner-id="winnerId"
      grow
      @vote="handleVote"
    />
    <div v-if="!enableCompare" class="versus__icon">
      VS
    </div>
    <router-link 
      v-if="enableCompare"
      class="versus__icon"
      :to="compareLink"
    >
      VS
    </router-link>
  </div>
</template>

<script>
import { VersusCard } from '@/components/Cards';

import Urls from '@/constants/urls';

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
    },
    enableCompare: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    compareLink: function() {
      const ids = this.characters.map(x => x.id).join(',');
      return `${Urls.versusComparison}?characterIds=${ids}`;
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
  justify-content: center;

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: auto;
    padding: 0;
    border-width: 1px;
    transform: translateY(-50%) translateX(-50%);
    border-radius: 50px;
    text-align: center;
  }
}
</style>
