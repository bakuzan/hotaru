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
import {
  mapEnumToSelectBoxOptions,
  mapPagedResponseToUpdate
} from '@/utils/mappers';

const size = 10;
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
        sources: [...SourceType]
      },
      page: 0,
      showMoreEnabled: true,
      seriesPaged: {
        nodes: [],
        total: 0
      }
    };
  },
  apollo: {
    seriesPaged: {
      query: Query.getSeriesPaged,
      debounce: 1000,
      variables: {
        search: '',
        sources: [...SourceType],
        paging: {
          page: 0,
          size
        }
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
      this.page = 0;

      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.$apollo.queries.seriesPaged.refetch({
          ...this.filters,
          paging: {
            page: this.page,
            size
          }
        });
      }, 1000);
    },
    onAdd: function() {
      this.$router.push(Urls.seriesCreate);
    },
    showMore() {
      this.page++;
      this.$apollo.queries.seriesPaged.fetchMore({
        variables: {
          ...this.filters,
          paging: {
            page: this.page,
            size
          }
        },
        updateQuery: (...response) => {
          const updated = mapPagedResponseToUpdate(...response);
          this.showMoreEnabled = updated.hasMore;
          return updated;
        }
      });
    }
  }
};
</script>
