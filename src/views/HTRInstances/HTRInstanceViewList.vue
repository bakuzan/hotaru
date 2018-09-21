<template>
  <div class="instance-view">
    <List 
      is-sortable
      columns="one"
      :items="sortedItems"
      @update="onSorting"
    >
      <template slot-scope="slotProps">
        <ListFigureCard
          v-show="isNotRankSorted"
          v-bind="slotProps.item" 
          figure-size="small"
          figure-direction="row"
          :url-source="cardUrl" 
          :remove="handleRemove"
        />
        <RankingCard
          v-show="!isNotRankSorted"
          :character="slotProps.item"
          :rank="getRank(slotProps.item)"
        />
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import { ListFigureCard, RankingCard } from '@/components/Cards';

import Urls from '@/constants/urls';
import { Orders } from '@/constants/htr-instance-settings';
import { orderBy } from '@/utils';

export default {
  name: 'HTRInstanceViewList',
  components: {
    List,
    ListFigureCard,
    RankingCard
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      cardUrl: Urls.characterView
    };
  },
  computed: {
    isNotRankSorted: function() {
      return this.options.order !== Orders.rank;
    },
    sortedItems: function() {
      const { order: sortType } = this.options;

      if (sortType === Orders.name) {
        return orderBy(this.items, ['name']);
      } else if (sortType === Orders.rank) {
        return orderBy(this.items, ['ranking.rank']);
      } else {
        return this.options.customOrder
          ? this.options.customOrder.map((x) =>
              this.items.find((c) => c.id === x)
            )
          : this.items;
      }
    }
  },
  methods: {
    handleRemove: function(characterId) {
      this.$emit('remove', characterId);
    },
    getRank: function(item) {
      return item && item.ranking ? item.ranking.rank : '';
    },
    onSorting: function(event) {
      this.options.customOrder.splice(
        event.newIndex,
        0,
        this.options.customOrder.splice(event.oldIndex, 1)[0]
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';
</style>
