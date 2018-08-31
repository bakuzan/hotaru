<template>
    <div class="rank-card">
        <div class="rank-card__number">{{rank}}</div>
        <ImageCard
            v-bind="$props"
            :display-image="character.displayImage"
            hide-caption
        />
        <div class="rank-card__content">
            {{character.name}}
        </div>
  </div>
</template>

<script>
import ImageCard from './ImageCard';

export default {
  name: 'RankingCard',
  components: {
    ImageCard
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
  }
};
</script>
