<template>
    <div class="versus-card">
        <ListFigureCard
            v-bind="item" 
            :url-source="characterCardUrl"
            open-new-tab
        />
        <Button
            :className="buttonClasses"
            :icon="maybeWinningIcon"
            :disabled="winnerId"
            @click="handleVote"
        >
            <span class="versus-card__vote-text">Vote {{item.name}}</span>
        </Button>
    </div>
</template>

<script>
import classNames from 'classnames';

import ListFigureCard from './ListFigureCard';

import Urls from '@/constants/urls';
import Icons from '@/constants/icons';

export default {
  name: 'VersusCard',
  components: {
    ListFigureCard
  },
  props: {
    item: {
      type: Object
    },
    winnerId: {
      type: Number,
      default: null
    }
  },
  data: function() {
    return {
      characterCardUrl: Urls.characterView
    };
  },
  computed: {
    buttonClasses: function() {
      return classNames('versus-card__vote-button', {
        'versus-card__vote-button--has-winner': this.winnerId,
        'versus-card__vote-button--is-winner': this.isWinner
      });
    },
    maybeWinningIcon: function() {
      return this.isWinner ? Icons.tick : null;
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

.versus-card__vote-button--has-winner .versus-card__vote-text {
  visibility: hidden;
}
</style>
