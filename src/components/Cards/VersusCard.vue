<template>
  <div :id="versusId" :class="cardClasses">
    <ListFigureCard
      v-bind="item"
      :url-source="isDummy ? null : characterCardUrl"
      :figure-size="figureSize"
      :open-new-tab="openNewTab"
      class="versus-card__figure-card"
    />
    <div
      v-if="item.seed"
      class="versus-card__seed themed-background"
      title="Seed in bracket"
    >
      {{ item.seed }}
    </div>
    <div class="flex-spacer"></div>
    <VoteButton
      :has-winner="!!winnerId"
      :is-winner="isWinner"
      :is-champion="isWinner && isFinal"
      :disabled="isDummy"
      :name="item.name"
      @click="handleVote"
      >Vote {{ item.name }}</VoteButton
    >
  </div>
</template>

<script>
import classNames from 'classnames';

import ListFigureCard from './ListFigureCard';
import { VoteButton } from '@/components/Buttons';

import Urls from '@/constants/urls';
import { generateUniqueId } from '@/utils';

export default {
  name: 'VersusCard',
  components: {
    ListFigureCard,
    VoteButton
  },
  props: {
    item: {
      type: Object,
      required: true
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
      validator: function (value) {
        return value === null || ['small'].includes(value);
      }
    },
    openNewTab: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      versusId: generateUniqueId(),
      characterCardUrl: Urls.characterView
    };
  },
  computed: {
    cardClasses: function () {
      return classNames('versus-card', {
        'versus-card--grow': this.grow,
        'versus-card--is-dummy': this.isDummy,
        'versus-card--is-champion': this.isWinner && this.isFinal
      });
    },
    isWinner: function () {
      return this.item.id === this.winnerId;
    }
  },
  methods: {
    handleVote: function () {
      if (this.isDummy || this.winnerId) return;
      this.$emit('vote', this.item.id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.versus-card {
  display: flex;
  flex-direction: column;
  width: calc(50% - #{$versus-icon-min-width});
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
<style lang="scss">
.list-figure-card.versus-card__figure-card {
  height: auto;
}
</style>
