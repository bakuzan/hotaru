<template>
    <section class="character-of-the-day">
      <header class="character-of-the-day__header">
        <h4 class="character-of-the-day__title">Character of the Day</h4>
      </header>
      <LoadingBouncer v-show="isLoading" local />
      <ListFigureCard
          v-show="!isLoading"
          v-bind="characterOfTheDay"
          :url-source="cardUrl"
      />
    </section>
</template>

<script>
import { ListFigureCard } from '@/components/Cards';
import LoadingBouncer from '@/components/LoadingBouncer';

import Urls from '@/constants/urls';
import { Mutation } from '@/graphql';

export default {
  name: 'CharacterOfTheDayWidget',
  components: {
    ListFigureCard,
    LoadingBouncer
  },
  data: function() {
    return {
      cardUrl: Urls.characterView,
      isLoading: true,
      characterOfTheDay: {}
    };
  },
  created() {
    this.$apollo
      .mutate({
        mutation: Mutation.getCharacterOfTheDay
      })
      .then(({ data }) => {
        this.characterOfTheDay = data.characterOfTheDay;
        this.isLoading = false;
      });
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';

.character-of-the-day {
  position: relative;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__title {
    margin: $app--margin-standard;
  }
}
</style>
