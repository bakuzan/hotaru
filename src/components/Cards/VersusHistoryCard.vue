<template>
  <div :class="cardClasses">
    <ListFigureCard
      v-bind="opponent"
      :url-source="characterCardUrl"
      :figure-size="figureSize"
      open-new-tab
    />
    <div>
      <div>{{item.updatedAt}}</div>
      <div>
        placeholder for success/failure colour
      </div>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';

import ListFigureCard from './ListFigureCard';

import Urls from '@/constants/urls';

export default {
  name: 'VersusHistoryCard',
  components: {
    ListFigureCard
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
    }
  },
  data: function() {
    return {
      characterCardUrl: Urls.characterView
    };
  },
  computed: {
    cardClasses: function() {
      return classNames('versus-history-card');
    },
    opponent: function() {
      return this.item.characters.find((x) => x.id !== this.characterId) || {};
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
