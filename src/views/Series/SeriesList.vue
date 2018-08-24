<template>
  <div class="page">
    <ListFilterBar 
      v-bind="filters"
      @input="onInput"
      @add="onAdd"
    >
      <MultiSelect 
        :slot="typeSlotName"
        id="source"
        name="sources"
        label="sources"
        :values="filters.sources"
        :options="mappedSources"
        @update="onInput"
      />
    </ListFilterBar>
    <List 
      className="series"
      itemClassName="series__item"
      :items="series"
    >
      <template slot-scope="slotProps">
        <ListFigureCard 
          v-bind="slotProps.item" 
          :url-source="cardUrl" 
        />
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import ListFilterBar from '@/components/ListFilterBar';
import { ListFigureCard } from '@/components/Cards';
import MultiSelect from '@/components/MultiSelect';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import SourceType from '@/constants/source-type';
import { Query } from '@/graphql';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';

export default {
  name: 'SeriesList',
  components: {
    List,
    ListFilterBar,
    ListFigureCard,
    MultiSelect
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType,
      cardUrl: Urls.seriesView,
      searchTimer: null,
      filters: {
        search: '',
        sources: []
      },
      series: []
    };
  },
  apollo: {
    series: {
      query: Query.getSeries,
      debounce: 1000,
      variables() {
        return { ...this.filters };
      }
    }
  },
  computed: {
    mappedSources: function() {
      return mapEnumToSelectBoxOptions(SourceType);
    }
  },
  methods: {
    onInput: function(value, name) {
      this.filters[name] = value;
    },
    onAdd: function() {
      this.$router.push(Urls.seriesCreate);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
