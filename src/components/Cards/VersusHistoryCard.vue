<template>
  <div :class="cardClasses">
    <ListFigureCard
      v-bind="opponent"
      :url-source="characterCardUrl"
      :figure-size="figureSize"
      :style="{ width: '25%' }"
      :open-new-tab="openNewTab"
    />
    <div>
      <div class="padded padded--standard">
        {{item.updatedAt}}
      </div>
      <div class="padded padded--standard">
        {{item.type}}
      </div>
      <div>
        <VoteButton 
          :has-winner="!!item.winnerId"
          :is-winner="isWinner"
          show-lost-colour
        />
      </div>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';

import ListFigureCard from './ListFigureCard';
import { VoteButton } from '@/components/Buttons';

import Urls from '@/constants/urls';

export default {
  name: 'VersusHistoryCard',
  components: {
    ListFigureCard,
    VoteButton
  },
  props: {
    characterId: {
      type: Number
    },
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
    },
    openNewTab: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    characterCardUrl: function() {
      const hash = this.$router.history.current.hash || '';
      return `${Urls.characterView}${hash}`;
    },
    cardClasses: function() {
      return classNames('versus-history-card');
    },
    opponent: function() {
      return this.item.characters.find((x) => x.id !== this.characterId) || {};
    },
    isWinner: function() {
      return this.item.winnerId === this.characterId;
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.versus-history-card {
  display: flex;
  width: 100%;
}
</style>
