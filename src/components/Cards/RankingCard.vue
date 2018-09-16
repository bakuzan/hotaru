<template>
    <div class="rank-card">
        <div class="rank-card__rank rank">
          <div class="rank__bubble">{{rank}}</div>
        </div>
        <ImageCard
          v-bind="$props"
          :url="character.displayImage"
          figure-size="small"
          hide-caption
        />
        <div class="rank-card__content">
          <div class="rank-card__text">
            <NavLink 
              class="rank-card__link"
              :to="cardUrl"
            >
            {{character.name}}
            </NavLink>
          </div>
          <div class="rank-card__text">{{winsText}}</div>
          <div class="rank-card__text">{{scoreText}}</div>
        </div>
  </div>
</template>

<script>
import ImageCard from './ImageCard';
import NavLink from '@/components/NavLink';

import Urls from '@/constants/urls';

export default {
  name: 'RankingCard',
  components: {
    ImageCard,
    NavLink
  },
  props: {
    id: {
      type: Number
    },
    rank: {
      type: Number
    },
    score: {
      type: Number
    },
    wins: {
      type: Number
    },
    character: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    winsText: function() {
      if (this.wins === undefined) return null;
      return this.wins === 1 ? `${this.wins} win` : `${this.wins} wins`;
    },
    scoreText: function() {
      if (this.score === undefined) return null;
      return this.score === null ? 'No rating' : `${this.score} rating`;
    },
    cardUrl: function() {
      return Urls.build(Urls.characterView, { id: this.character.id });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.rank-card {
  display: flex;
  width: 100%;

  &__rank {
    @extend %center-contents;
    min-width: 2em;
    max-width: 3em;
  }

  &__content {
    padding: $app--padding-standard 0;
  }

  &__text {
    padding: $app--padding-small 0;
  }

  &__link {
    justify-content: flex-start;
    height: auto;
    padding: $app--padding-small 0;
    border: none;
  }
}

$rank-bubble-size: 1.5em;
.rank__bubble {
  @extend %center-contents;
  width: $rank-bubble-size;
  height: $rank-bubble-size;
  @extend %standard-border;
  border-radius: 50%;
  font: {
    weight: bold;
    size: $rank-bubble-size;
  }
}
</style>
