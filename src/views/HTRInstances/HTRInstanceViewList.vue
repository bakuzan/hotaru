<template>
  <div class="instance-view">
    <List 
      columns="one"
      :is-sortable="isCustomOrder"
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
          :remove="handleRemove"
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
    order: {
      type: Number,
      required: true
    },
    customOrder: {
      type: Array
    }
  },
  data: function() {
    return {
      cardUrl: Urls.characterView
    };
  },
  computed: {
    isNotRankSorted: function() {
      return this.order !== Orders.rank;
    },
    isCustomOrder: function() {
      return this.order === Orders.custom;
    },
    sortedItems: function() {
      const sortType = this.order;

      if (sortType === Orders.name) {
        return [...orderBy(this.items, ['name'])];
      } else if (sortType === Orders.rank) {
        return [...orderBy(this.items, ['ranking.rank'])];
      } else if (this.isCustomOrder) {
        return this.customOrder
          ? [...this.customOrder.map((x) => this.items.find((c) => c.id === x))]
          : [...this.items];
      } else {
        return [...this.items];
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
      const from = event.oldIndex;
      const to = event.newIndex;
      this.$emit('moved', from, to);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';
</style>
