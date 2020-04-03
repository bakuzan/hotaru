<template>
  <section class="honours">
    <header class="honours__header">
      <h4 class="honours__title">Honours</h4>
    </header>
    <LoadingBouncer v-show="isLoading" local />
    <List
      :items="honoursList"
      class-name="honours-list"
      item-class-name="honours-list__item honour"
      columns="one"
    >
      <template slot-scope="slotProps">
        <div class="honour__title">
          <div class="honour__text">{{ slotProps.item.title }}</div>
          <div class="honour__context">
            <div class="honour__context-label">
              {{ slotProps.item.contextLabel }}
            </div>
          </div>
        </div>
        <ListFigureCard
          v-if="slotProps.item.character"
          v-show="!isLoading"
          v-bind="slotProps.item.character"
          :url-source="cardUrl"
        />
        <VersusWidget
          v-else-if="slotProps.item.characters"
          v-show="!isLoading"
          v-bind="slotProps.item"
          enable-compare
        />
      </template>
    </List>
  </section>
</template>

<script>
import { ListFigureCard } from '@/components/Cards';
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';
import VersusWidget from '@/components/Widgets/VersusWidget';

import Urls from '@/constants/urls';
import { Query } from '@/graphql';
import {
  separateAndCapitalise,
  generateUniqueId,
  diffInDaysAndHours
} from '@/utils';

export default {
  name: 'HonoursWidget',
  components: {
    ListFigureCard,
    LoadingBouncer,
    List,
    VersusWidget
  },
  data: function () {
    return {
      cardUrl: Urls.characterView,
      honours: {}
    };
  },
  apollo: {
    honours: {
      query: Query.getHonours,
      fetchPolicy: 'network-only'
    }
  },
  computed: {
    isLoading: function () {
      return this.$apollo.queries.honours.loading;
    },
    honoursList: function () {
      return [...this.mostWinsList, ...this.versusList];
    },
    mostWinsList: function () {
      const list = ['mostWinsInLast7Days', 'mostWinsInLast30Days']
        .map((key) => {
          const data = this.honours[key];
          if (!data) return null;

          const { count } = data;
          const tempTitle = separateAndCapitalise(key);
          const [old, word, num] = tempTitle.match(/([A-Za-z]+)([0-9]+)/);
          const title = tempTitle.replace(old, `${word} ${num}`);

          return {
            id: generateUniqueId(),
            title,
            contextLabel: count,
            character: {
              ...data
            }
          };
        })
        .filter((x) => x !== null);

      return list;
    },
    versusList: function () {
      const results = [];
      const { mostCommonVersus, longestVersus, closestRivalry } = this.honours;

      if (mostCommonVersus) {
        results.push({
          id: generateUniqueId(),
          title: 'Most Common Versus',
          contextLabel: `${mostCommonVersus.fights} fights\n(${mostCommonVersus.c1Wins} - ${mostCommonVersus.c2Wins})`,
          characters: this.setVersusOrder(mostCommonVersus),
          winnerId: -1
        });
      }

      if (closestRivalry) {
        results.push({
          id: generateUniqueId(),
          title: 'Closest Rivalry',
          contextLabel: `${closestRivalry.fights} fights\n(${closestRivalry.c1Wins} - ${closestRivalry.c2Wins})`,
          characters: this.setVersusOrder(closestRivalry),
          winnerId: -1
        });
      }

      if (longestVersus) {
        results.push({
          id: generateUniqueId(),
          title: 'Hardest Decision',
          contextLabel: diffInDaysAndHours(longestVersus.diff),
          characters: this.setVersusOrder(longestVersus),
          winnerId: longestVersus.winnerId
        });
      }

      return results;
    }
  },
  methods: {
    setVersusOrder: function (versus) {
      return (versus.characters || []).map((c) => ({
        ...c,
        order: c.id === versus.cId1 ? 1 : 2
      }));
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
    flex-direction: column;
  }
  &__text {
    font-style: italic;
  }
  &__context,
  &__text {
    display: flex;
    justify-content: center;
    margin: #{$app--margin-standard / 2} $app--margin-standard;
  }
  &__context-label {
    padding: $app--padding-small;
    border: 1px solid transparent;
    border-radius: 5px;
  }
}
</style>
