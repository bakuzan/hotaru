<template>
  <div class="shared-opponent-card">
    <div class="shared-opponent-card__results">
      <div>{{left.total}} matches</div>
      <div>{{left.wins}} wins</div>
    </div>
    <ListFigureCard v-bind="opponent" :url-source="cardUrl"/>
    <div class="shared-opponent-card__results">
      <div>{{right.total}} matches</div>
      <div>{{right.wins}} wins</div>
    </div>
  </div>
</template>

<script>
import ListFigureCard from '@/components/Cards/ListFigureCard';

import Urls from '@/constants/urls';

export default {
  name: 'VersusSharedOpponentCard',
  components: {
    ListFigureCard
  },
  props: {
    opponent: {
      type: Object
    },
    left: {
      type: Object
    },
    right: {
      type: Object
    }
  },
  data: function() {
    return {
      cardUrl: Urls.characterView
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.shared-opponent-card {
  display: flex;
  flex: 1;

  &__results {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
}
</style>
