<template>
    <section class="honours">
      <header class="honours__header">
        <h4 class="honours__title">Honours</h4>
      </header>
      <LoadingBouncer v-show="isLoading" local />
      <List
        className="honours-list"
        itemClassName="honours-list__item honour"
        columns="one"
        :items="honoursList"
      >
        <template slot-scope="slotProps">
          <div class="honour__title">
            {{slotProps.item.title}}
            <span class="honour__count">- {{slotProps.item.count}}</span>
          </div>
          <ListFigureCard
            v-show="!isLoading"
            v-bind="slotProps.item.character"
            :url-source="cardUrl"
          />
        </template>
      </List>
    </section>
</template>

<script>
import { ListFigureCard } from '@/components/Cards';
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';

import Urls from '@/constants/urls';
import { Query } from '@/graphql';
import { separateAndCapitalise, generateUniqueId } from '@/utils';

export default {
  name: 'HonoursWidget',
  components: {
    ListFigureCard,
    LoadingBouncer,
    List
  },
  data: function() {
    return {
      cardUrl: Urls.characterView,
      excludedKeys: ['__typename'],
      honours: {}
    };
  },
  apollo: {
    honours: {
      query: Query.getHonours
    }
  },
  computed: {
    isLoading: function() {
      return this.$apollo.queries.honours.loading;
    },
    honoursList: function() {
      const list = Object.keys(this.honours || {})
        .filter((x) => !this.excludedKeys.includes(x))
        .map((key) => {
          const data = this.honours[key];
          console.log(key);
          if (!data) return null;
          const { count } = data;
          const tempTitle = separateAndCapitalise(key);
          const [old, word, num] = tempTitle.match(/([A-Za-z]+)([0-9]+)/);
          const title = tempTitle.replace(old, `${word} ${num}`);

          return {
            id: generateUniqueId(),
            title,
            count,
            character: {
              ...data
            }
          };
        })
        .filter((x) => x !== null);
      console.log(list);
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.honours {
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
<style lang="scss">
@import '../../styles/_variables';

.honours-list {
  &__item {
    display: flex;
    flex-direction: column;
  }
}
.honour {
  &__title {
    display: flex;
    justify-content: center;
    font-style: italic;
  }
  &__count {
    margin: 0 $app--margin-standard;
    font-style: normal;
  }
}
</style>
