<template>
  <div class="rank-card">
    <Button
      v-if="remove"
      :icon="removeIcon"
      class="rank-card__remove"
      size="small"
      theme="secondary"
      @click="handleRemove"
    />
    <div class="rank-card__rank rank">
      <div class="rank__bubble">{{ rank }}</div>
    </div>
    <ImageCard
      v-bind="$props"
      :name="character.name"
      :url="character.displayImage"
      :figure-size="figureSize"
      hide-caption
    />
    <div class="rank-card__content">
      <div class="rank-card__text">
        <NavLink
          :to="cardUrl"
          :title="character.name"
          class="rank-card__link"
          >{{ character.name }}</NavLink
        >
      </div>
      <div class="rank-card__text" :title="scoreText">{{ winsText }}</div>
      <div class="rank-card__text" :title="scoreText">{{ totalText }}</div>
    </div>
  </div>
</template>

<script>
import ImageCard from './ImageCard';
import NavLink from '@/components/NavLink';
import { Button } from '@/components/Buttons';

import Urls from '@/constants/urls';
import Icons from '@/constants/icons';

export default {
  name: 'RankingCard',
  components: {
    ImageCard,
    NavLink,
    Button
  },
  props: {
    rank: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      default: undefined
    },
    wins: {
      type: Number,
      default: undefined
    },
    total: {
      type: Number,
      default: undefined
    },
    character: {
      type: Object,
      default: () => {}
    },
    remove: {
      type: Function,
      default: null
    },
    figureSize: {
      type: String,
      default: 'small',
      validator: function (value) {
        return value === null || ['small'].includes(value);
      }
    }
  },
  data: function () {
    return { removeIcon: Icons.cross };
  },
  computed: {
    winsText: function () {
      if (this.wins === undefined) return null;
      return this.wins === 1 ? `${this.wins} win` : `${this.wins} wins`;
    },
    totalText: function () {
      if (this.total === undefined) return null;
      return this.total === 1 ? `${this.total} match` : `${this.total} matches`;
    },
    scoreText: function () {
      if (this.score === undefined) return null;
      return this.score === null ? 'No rank order' : `${this.score} rank order`;
    },
    cardUrl: function () {
      return Urls.build(Urls.characterView, { id: this.character.id });
    }
  },
  methods: {
    handleRemove: function () {
      const id = this.id || this.character.id;
      this.remove(id);
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
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: $app--padding-standard 0;
  }

  &__text {
    padding: $app--padding-small 0;
  }

  &__link {
    // display: contents;
    width: auto;
    height: auto;
    padding: $app--padding-small 0;
    border: none;
  }

  &__remove {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 1px;
    margin: 1px;
    background: transparent; // Having background can cause overlap.
  }
}

.rank-card:hover {
  .rank-card__remove {
    display: block;
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
