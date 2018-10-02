<template>
  <div :class="cardClasses">
    <ListFigureCard
      v-bind="item"
      :url-source="isDummy ? null : characterCardUrl"
      :figure-size="figureSize"
      open-new-tab
    />
    <div 
      v-if="item.seed"
      class="versus-card__seed themed-background"
      title="Seed in bracket">
      {{item.seed}}
    </div>
    <VoteButton
      :has-winner="!!winnerId"
      :is-winner="isWinner"
      :is-champion="isWinner && isFinal"
      :disabled="isDummy"
      @click="handleVote"
    >
      Vote {{item.name}}
    </VoteButton>
  </div>
</template>

<script>
import classNames from 'classnames';

import ListFigureCard from './ListFigureCard';
import { Button, VoteButton } from '@/components/Buttons';

import Urls from '@/constants/urls';

export default {
  name: 'VersusCard',
  components: {
    ListFigureCard,
    Button,
    VoteButton
  },
  props: {
    item: {
      type: Object
    },
    winnerId: {
      type: Number,
      default: null
    },
    grow: {
      type: Boolean,
      default: false
    },
    isDummy: {
      type: Boolean,
      default: false
    },
    isFinal: {
      type: Boolean,
      default: false
    },
    figureSize: {
      type: String,
      default: 'small',
      validator: function(value) {
        return value === null || ['small'].includes(value);
      }
    }
  },
  data: function() {
    return {
      characterCardUrl: Urls.characterView
    };
  },
  computed: {
    cardClasses: function() {
      return classNames('versus-card', {
        'versus-card--grow': this.grow,
        'versus-card--is-dummy': this.isDummy,
        'versus-card--is-champion': this.isWinner && this.isFinal
      });
    },
    isWinner: function() {
      return this.item.id === this.winnerId;
    }
  },
  methods: {
    handleVote: function() {
      if (this.isDummy || this.winnerId) return;
      this.$emit('vote', this.item.id);
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.versus-card {
  width: 50%;
  padding: $app--padding-small;

  &--grow {
    flex: 1;
  }

  &__seed {
    $seed-size: 1.5em;

    position: relative;
    @extend %center-contents;
    width: $seed-size;
    height: $seed-size;
    border-radius: 50%;
    margin-top: -$seed-size;
    font-size: $seed-size * 0.5;
  }
}
</style>
