<template>
  <div class="page character-view">
      <div class="character-view__left-column">
        <HTRImage 
          :src="character.displayImage" 
          class="character-view__image" 
        />
      </div>
      <section class="character-view__content character-info">
        <header class="character-info__header">
          <h4>{{character.name}}</h4>
          <span>{{character.gender}}</span>
        </header>
        <div class="character-info__content">
          <div class="view-block view-block--read-only">
              <label class="view-block__label">{{ characterSeries ? "Series" : noSeries }}</label>
              <div>{{characterSeries}}</div>
          </div>
          <div class="view-block view-block--read-only">
            - tags?
            - gallery?
            - ranking info?
          </div>
          
        </div>
      </section>
  </div>
</template>

<script>
import HTRImage from '@/components/HTRImage';

import Strings from '@/constants/strings';
import { Query } from '@/graphql';
import * as Routing from '@/utils/routing';

export default {
  name: 'CharactersView',
  components: {
    HTRImage
  },
  data: function() {
    return {
      character: {}
    };
  },
  apollo: {
    character: {
      query: Query.getCharacter,
      variables() {
        const id = Number(Routing.getParam(this.$router, 'id'));
        return { id };
      },
      update(data) {
        return data.characterById;
      }
    }
  },
  computed: {
    characterSeries: function() {
      const { series = {} } = this.character;
      return series ? series.name : '';
    },
    noSeries: function() {
      return Strings.missing.series;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables';

.character-view {
  display: flex;

  &__image {
    max-height: 300px;
    margin-left: 0;
  }

  &__left-column {
    display: flex;
    flex-basis: 20%;
    padding: $app--standard-padding;
  }
  &__content {
    display: flex;
    flex-basis: 80%;
    flex-direction: column;
  }
}

.view-block {
  padding: $app--standard-padding 0;

  &__label {
    font-weight: bold;
  }
}
</style>
