<template>
  <div class="instance-view bracket">
    <div 
      v-for="(round, i) in bracket" 
      :key="i"
      class="bracket__round"
    >
      <VersusWidget 
        v-for="match in round" 
        :key="match.id"
        v-bind="match"
        enable-compare
        @vote="handleVote"
      />
    </div>
  </div>
</template>

<script>
import VersusWidget from '@/components/VersusWidget';

import Urls from '@/constants/urls';
import { generateUniqueId, bracketProgression } from '@/utils';

export default {
  name: 'HTRInstanceViewBracket',
  components: {
    VersusWidget
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {};
  },
  apollo: {},
  computed: {
    bracketRounds: function() {
      const { layout } = this.options;
      const round = (layout && layout[0]) || [];
      const firstRoundMatchCount = round.length;
      return bracketProgression(firstRoundMatchCount);
    },
    bracket: function() {
      const { layout = [] } = this.options;
      const existingProgress = layout.map((round) =>
        round.map((id) => this.items.find((x) => x.id === id))
      );

      const fullBracket = this.bracketRounds.map((size, i) => {
        const round = existingProgress[i];
        if (!round) return this.getDummyRound(size);
        return [...round];
      });
      console.log(layout, this.bracketRounds, fullBracket);
      return fullBracket;
    }
  },
  methods: {
    getDummyVersus: function() {
      // TODO
      // Display previous winner character if any have won!
      return {
        isDummy: true,
        id: generateUniqueId(),
        characters: [
          {
            id: generateUniqueId(),
            name: 'TBC',
            displayImage: Urls.images.characterPlaceholder
          },
          {
            id: generateUniqueId(),
            name: 'TBC',
            displayImage: Urls.images.characterPlaceholder
          }
        ]
      };
    },
    getDummyRound: function(count) {
      return Array(count)
        .fill(null)
        .map(this.getDummyVersus);
    },
    handleVote: function(versusId, winnerId) {
      console.log('voted', versusId, winnerId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.bracket {
  display: flex;

  &__round {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
  }
}
</style>
