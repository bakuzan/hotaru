<template>
  <div :class="cardClasses">
    <ListFigureCard
      v-bind="item" 
      :url-source="characterCardUrl"
      figure-size="small"
      open-new-tab
    />
    <VoteButton
      :has-winner="!!winnerId"
      :is-winner="isWinner"
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
    }
  },
  data: function() {
    return {
      characterCardUrl: Urls.characterView
    };
  },
  computed: {
    cardClasses: function() {
      return classNames('versus-card', { 'versus-card--grow': this.grow });
    },
    isWinner: function() {
      return this.item.id === this.winnerId;
    }
  },
  methods: {
    handleVote: function() {
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
  padding: $app--padding-small;

  &--grow {
    width: 50%;
  }

  &__vote-button {
    width: 100%;
    margin: auto;

    &--has-winner .versus-card__vote-text {
      visibility: hidden;
    }

    &--is-winner::before {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: $app--success-background-colour;
      color: $app--success-colour;
      font-size: 1em;
    }
  }
}
</style>
