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
      wrap
      columns="four"
      className="series"
      itemClassName="series__item"
      :items="seriesPaged.nodes"
      @intersect="showMore"
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
import { defaultPagedResponse } from '@/utils/models';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';
import * as LP from '@/utils/list-pages';

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
      mappedSources: mapEnumToSelectBoxOptions(SourceType),
      filterHandler: LP.updateFilterAndRefetch(this, 'seriesPaged'),
      searchTimer: null,
      filters: {
        search: '',
        sources: [...SourceType]
      },
      page: 0,
      seriesPaged: defaultPagedResponse()
    };
  },
  apollo: {
    seriesPaged: {
      query: Query.getSeriesPaged,
      variables: {
        search: '',
        sources: [...SourceType],
        paging: {
          page: 0,
          size: LP.size
        }
      }
    }
  },
  methods: {
    onAdd: function() {
      this.$router.push(Urls.seriesCreate);
    },
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(this, 'seriesPaged');
    }
  }
};
</script>
