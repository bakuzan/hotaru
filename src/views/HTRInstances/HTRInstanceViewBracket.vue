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
        v-bind="match"
        :key="match.id"
        :class="bracketVersusClass(i)"
        :is-final="isFinal(i)"
        enable-compare
        open-new-tab
        column
        @vote="handleVote"
      />
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';
import panzoom from 'panzoom';
import VersusWidget from '@/components/VersusWidget';

import Urls from '@/constants/urls';
import { generateUniqueId, bracketProgression, orderBy } from '@/utils';
import { Query, Mutation } from '@/graphql';
import { mapHTRInstanceToStore } from '@/utils/mappers';
import bracketLineDrawer from '@/utils/bracket-lines';

// const mapToWinnerIds = (p, r) => [...p, ...r.map((v) => v.winnerId)];

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
      const dataUpdated = newV && (!oldV || newV.length !== oldV.length);
      // const nWinners = newV.reduce(mapToWinnerIds, []).filter((x) => !!x);
      // const oWinners = oldV.reduce(mapToWinnerIds, []).filter((x) => !!x);
      // const winnerChosen = oWinners.length !== nWinners.length;
      // console.log('layout changed', nWinners, oWinners, dataUpdated);
      if (dataUpdated) {
        this.$nextTick(this.updateCanvas);
      }
    }
  },
  mounted() {
    this.zoomController = panzoom(this.$refs[this.bracketRef], {
      zoomSpeed: 0.1,
      maxZoom: 2,
      minZoom: 0.05,
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
      const { rules = {}, seedOrder } = this.options;
      const { isSeeded } = rules;
      let result = this.items;

      if (isSeeded) {
        const characterList = this.items.reduce(
          (p, c) => [...p, ...c.characters],
          []
        );
        const seeds = seedOrder
          ? seedOrder.map((id) => characterList.find((x) => x.id === id))
          : orderBy(characterList, ['ranking.rank']);

        result = this.items.map((v) => ({
          ...v,
          characters: v.characters.map((c) => ({
            ...c,
            seed: seeds.findIndex((s) => s.id === c.id) + 1
          }))
        }));
      }

      result = result.map((x, i, arr) => ({
        ...x,
        characters: x.characters.map((c) => ({
          ...c,
          order: arr.findIndex((v) => v.characters.some((vc) => vc.id === c.id))
        }))
      }));

      return result;
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
    bracketVersusClass: function(index) {
      return classNames('bracket__versus', {
        'bracket__versus--is-final': this.isFinal(index)
      });
    },
    updateCanvas: function() {
      const canvas = this.$refs[this.canvasRef];
      const layout = this.customBracketLayout;
      // const transform = this.zoomController.getTransform();
      // const { scale, x, y } = transform;
      // console.log('update canvas >', canvas, transform);
      // canvas.style.cssText = `
      //   top: ${y * -1}px;
      //   left: ${x * -1}px;
      //   transform-origin: 0px 0px 0px;
      //   transform: matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})
      // `;
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

$bracket-width: 350px;

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
    min-width: $bracket-width;
    padding: $app--padding-standard;
    margin: 0 #{$bracket-width / 3};
  }

  &__versus {
    & + & {
      margin-top: 33%;
    }
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
