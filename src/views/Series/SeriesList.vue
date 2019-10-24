<template>
  <div class="page">
    <ListFilterBar v-bind="filters" @input="onInput" @add="onAdd">
      <MultiSelect
        id="source"
        :slot="typeSlotName"
        :values="filters.sources"
        :options="mappedSources"
        name="sources"
        label="sources"
        @update="onInput"
      />
    </ListFilterBar>
    <List
      :items="seriesPaged.nodes"
      :paged-total="seriesPaged.total"
      class="series"
      item-class-name="series__item"
      is-grid="standard"
      @intersect="showMore"
    >
      <template slot-scope="slotProps">
        <ListFigureCard v-bind="slotProps.item" :url-source="cardUrl" />
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
import SourceType from '@/constants/sourceType';
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
      seriesPaged: defaultPagedResponse()
    };
  },
  metaInfo: {
    title: 'Series List | Hotaru'
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
      LP.showMore(this, 'seriesPaged', 'SeriesPage');
    }
  }
};
</script>
