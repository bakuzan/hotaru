<template>
  <div :class="cardClasses">
    <ListFigureCard
      v-bind="item"
      :url-source="isDummy ? null : characterCardUrl"
      figure-size="small"
      open-new-tab
    />
    <VoteButton
      :has-winner="!!winnerId"
      :is-winner="isWinner"
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
        'versus-card--is-dummy': this.isDummy
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
  padding: $app--padding-small;

  &--grow {
    width: 50%;
  }
}
</style>
