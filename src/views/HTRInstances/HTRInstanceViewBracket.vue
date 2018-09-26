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
        class="bracket__versus"
        enable-compare
        v-bind="match"
        :is-final="isFinal(i)"
        @vote="handleVote"
      />
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom';
import VersusWidget from '@/components/VersusWidget';

import Urls from '@/constants/urls';
import { generateUniqueId, bracketProgression, orderBy } from '@/utils';
import { Query, Mutation } from '@/graphql';
import { mapHTRInstanceToStore } from '@/utils/mappers';
import bracketLineDrawer from '@/utils/bracket-lines';

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
      zoomController: null,
      resizeListeners: null
    };
  },
  watch: {
    customBracketLayout: function(newV, oldV) {
      if (newV && (!oldV || newV.length !== oldV.length)) {
        this.$nextTick(this.updateCanvas);
      }
    }
  },
  mounted() {
    this.zoomController = panzoom(this.$refs[this.bracketRef], {
      zoomSpeed: 0.1,
      maxZoom: 1,
      minZoom: 0.1,
      smoothScroll: true,
      zoomDoubleClickSpeed: 4
    });
  },
  computed: {
    bracketRounds: function() {
      const { layout } = this.options;
      const round = (layout && layout[0]) || [];
      const firstRoundMatchCount = round.length;
      return bracketProgression(firstRoundMatchCount);
    },
    matches: function() {
      const { isSeeded } = this.options.rules || {};
      if (isSeeded) {
        const seeds = orderBy(
          this.items.reduce((p, c) => [...p, ...c.characters], []),
          ['ranking.rank']
        ).map((x, i) => ({ id: x.id, seed: i + 1 }));

        return this.items.map((v) => ({
          ...v,
          characters: v.characters.map((c) => ({
            ...c,
            seed: seeds.find((s) => s.id === c.id).seed
          }))
        }));
      }
      return this.items;
    },
    bracket: function() {
      if (!this.items.length) return [];

      const { layout = [] } = this.options;
      const existingProgress = [...layout].map((round) =>
        round.map((id) => this.matches.find((x) => x.id === id))
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
    isFinal: function(index) {
      return Math.floor(this.customBracketLayout.length / 2) === index;
    },
    updateCanvas: function() {
      const canvas = this.$refs[this.canvasRef];
      const layout = this.customBracketLayout;

      bracketLineDrawer(canvas, this.$el, layout);
    },
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
  position: relative;
  display: flex;
  width: 20000px;
  outline: none;

  &__round {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 0;
    min-width: 350px;
    padding: $app--padding-standard;
    margin: 0 $app--margin-large;
  }

  &__versus + &__versus {
    // TODO
    // Space the versus out within the column without this
    margin-top: 182px;
  }

  &__canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
