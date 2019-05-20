<template>
  <div class="instance-view">
    <List
      :is-sortable="isCustomOrder"
      :items="sortedItems"
      columns="one"
      @update="onSorting"
    >
      <template slot-scope="slotProps">
        <ListFigureCard
          v-bind="slotProps.item"
          :url-source="cardUrl"
          :remove="handleRemove"
          figure-size="small"
          figure-direction="row"
        />
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import { ListFigureCard, RankingCard } from '@/components/Cards';

import Urls from '@/constants/urls';
import { Orders } from '@/constants/htrInstanceSettings';
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
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      cardUrl: Urls.characterView
    };
  },
  computed: {
    isCustomOrder: function() {
      return this.order === Orders.custom;
    },
    sortedItems: function() {
      const sortType = this.order;

      if (sortType === Orders.name) {
        return [...orderBy(this.items, ['name'])];
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
    onSorting: function(event) {
      const from = event.oldIndex;
      const to = event.newIndex;
      this.$emit('moved', from, to);
    }
  }
};
</script>

<style lang="scss">
.instance-view .list-figure-card {
  display: flex;
  flex: 1;
}
</style>
