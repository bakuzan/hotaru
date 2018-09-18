<template>
  <div class="instance-view bracket" :ref="bracketRef">
    <canvas class="bracket__canvas" :ref="canvasRef"></canvas>
    <div 
      v-for="(round, i) in customBracketLayout" 
      :key="i"
      class="bracket__round"
    >
      <VersusWidget 
        v-for="match in round" 
        :key="match.id"
        enable-compare
        v-bind="match"
        @vote="handleVote"
      />
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom';
import VersusWidget from '@/components/VersusWidget';

import Urls from '@/constants/urls';
import { generateUniqueId, bracketProgression } from '@/utils';
import { Query, Mutation } from '@/graphql';
import { mapHTRInstanceToStore } from '@/utils/mappers';

export default {
  name: 'HTRInstanceViewBracket',
  components: {
    VersusWidget
  },
  props: {
    bracketId: {
      type: Number
    },
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
    const id = generateUniqueId();
    return {
      mutationLoading: false,
      bracketRef: id,
      canvasRef: `canvas-${id}`,
      zoomController: null
    };
  },
  mounted() {
    /* 
      beforeWheel: function(e) return bool;
      zoomSpeed: 0.1 // 10% of wheel event
      maxZoom: 1,
      minZoom: 0.1
      smoothScroll: false
      zoomDoubleClickSpeed: 1 // 1 is disabled..above 1 is multiplier
    */
    this.zoomController = panzoom(this.$refs[this.bracketRef], {});
  },
  updated() {
    this.$nextTick(function() {
      const canvas = this.$refs[this.canvasRef];
      const ctx = canvas.getContext('2d');
      console.log(this, canvas, ctx);

      /*
        var rect = element.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(300,150);
        ctx.stroke();
      
      */
    });
  },
  computed: {
    bracketRounds: function() {
      const { layout } = this.options;
      const round = (layout && layout[0]) || [];
      const firstRoundMatchCount = round.length;
      return bracketProgression(firstRoundMatchCount);
    },
    bracket: function() {
      const { layout = [] } = this.options;
      const existingProgress = [...layout].map((round) =>
        round.map((id) => this.items.find((x) => x.id === id))
      );

      const fullBracket = this.bracketRounds.map((size, i) => {
        const round = existingProgress[i];
        if (round) return [...round];
        if (!size) return [];

        const previousRound = existingProgress[i - 1];
        return this.getDummyRound(size, previousRound);
      });

      return fullBracket;
    },
    customBracketLayout: function() {
      const columCount = this.bracket.length * 2 - 2;
      const customBracketLayout = this.bracket.reduce((p, r, i) => {
        const roundCount = r.length;
        const halfRound = roundCount / 2;
        const isFinalRound = Math.floor(halfRound) === 0;

        p[i] = isFinalRound ? r : r.slice(0, halfRound);
        if (!isFinalRound) {
          p[columCount - i] = r.slice(halfRound);
        }
        return p;
      }, []);

      return customBracketLayout;
    }
  },
  methods: {
    getDummyCharacter: function() {
      return {
        id: generateUniqueId(),
        name: 'TBC',
        displayImage: Urls.images.characterPlaceholder
      };
    },
    getDummyVersus: function(winners) {
      return {
        isDummy: true,
        enableCompare: winners.every((w) => !!w),
        id: generateUniqueId(),
        characters: winners.map((x) => (x ? x : this.getDummyCharacter()))
      };
    },
    getDummyRound: function(count, prev) {
      return Array(count)
        .fill(null)
        .map((_, pos) => {
          console.log(count, prev);
          const winningCharacters = !prev
            ? Array(2).fill(null)
            : prev.reduce((p, versus, i) => {
                const div = i / 2;
                const keep = Math.floor(div) === pos;
                if (!keep || !versus) return p;

                const place = div === pos ? 0 : 1;
                p[place] = !versus.winnerId
                  ? null
                  : {
                      ...versus.characters.find((c) => c.id === versus.winnerId)
                    };
                return p;
              }, []);

          return this.getDummyVersus(winningCharacters);
        });
    },
    handleVote: function(versusId, winnerId) {
      this.mutationLoading = true;

      this.$apollo
        .mutate({
          mutation: Mutation.castVoteInBracket,
          variables: { htrInstanceId: this.bracketId, versusId, winnerId },
          update: (store, { data: { htrInstanceVersusVote } }) => {
            const data = { ...htrInstanceVersusVote };

            store.writeQuery({
              query: Query.getHTRInstanceById,
              variables: { id: data.id },
              data: { htrInstanceById: mapHTRInstanceToStore(data) }
            });
          }
        })
        .then(() => {
          this.mutationLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.bracket {
  display: flex;
  outline: none;

  &__round {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    min-width: 350px;
    padding: $app--padding-standard;
    margin: 0 $app--margin-large;
  }

  &__canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }
}
</style>
