<template>
  <div class="page page-rankings">
    <div class="page-rankings__column">
      <ListFilterBar v-bind="filters" column hide-add @input="onInput">
        <MultiSelect
          :slot="typeSlotName"
          id="gender"
          name="genders"
          label="genders"
          :values="filters.genders"
          :options="mappedGenders"
          @update="onInput"
        />
        <MultiSelect
          :slot="typeSlotName"
          id="source"
          name="sources"
          label="sources"
          :values="filters.sources"
          :options="mappedSources"
          @update="onInput"
        />
        <div :slot="typeSlotName">
          <InputBoxAutocomplete
            id="seriesFilter"
            name="seriesFilter"
            label="Series"
            attr="name"
            :options="series"
            :filter="seriesFilter"
            @input="onSearchSeries"
            @on-select="onSelectSeries"
            disable-local-filter
          />

          <List columns="one" :items="selectedSeries">
            <template slot-scope="slotProps">
              <SeriesCard v-bind="slotProps.item" @remove="onRemoveSeries"/>
            </template>
          </List>
        </div>
      </ListFilterBar>
    </div>
    <List
      id="ranking-list"
      fixed-width
      columns="one"
      class="ranked-characters page-rankings__column"
      itemClassName="ranked-characters__item"
      :items="rankingsPaged.nodes"
      :paged-total="rankingsPaged.total"
      @intersect="showMore"
    >
      <template slot-scope="slotProps">
        <RankingCard v-bind="formatForRankingCard(slotProps.item)"/>
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List';
import ListFilterBar from '@/components/ListFilterBar';
import { RankingCard, SeriesCard } from '@/components/Cards';
import MultiSelect from '@/components/MultiSelect';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';

import Strings from '@/constants/strings';
import GenderType from '@/constants/gender-type';
import SourceType from '@/constants/source-type';
import { Query } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';
import * as LP from '@/utils/list-pages';

export default {
  name: 'RankingsList',
  components: {
    List,
    ListFilterBar,
    RankingCard,
    SeriesCard,
    MultiSelect,
    InputBoxAutocomplete
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType,
      mappedGenders: mapEnumToSelectBoxOptions(GenderType),
      mappedSources: mapEnumToSelectBoxOptions(SourceType),
      filterHandler: LP.updateFilterAndRefetch(this, 'rankingsPaged'),
      searchTimer: null,
      filters: {
        search: '',
        genders: [...GenderType],
        sources: [...SourceType],
        series: []
      },
      seriesFilter: '',
      rankingsPaged: defaultPagedResponse(),
      series: [],
      selectedSeries: []
    };
  },
  metaInfo: {
    title: 'Hotaru - Ranking List'
  },
  apollo: {
    rankingsPaged: {
      query: Query.getRankingsPaged,
      variables: {
        search: '',
        genders: [...GenderType],
        sources: [...SourceType],
        series: [],
        paging: {
          page: 0,
          size: LP.size
        }
      }
    },
    series: {
      query: Query.getSeries,
      debounce: 1000,
      skip() {
        return !this.seriesFilter;
      },
      variables() {
        return { search: this.seriesFilter };
      }
    }
  },
  methods: {
    onSearchSeries: function(value) {
      this.seriesFilter = value;
    },
    onSelectSeries: function(seriesId) {
      const series = this.series.find((x) => x.id === seriesId);
      this.selectedSeries = [...this.selectedSeries, series];
      this.seriesFilter = '';
      this.onSeriesInput();
    },
    onRemoveSeries: function(seriesId) {
      this.selectedSeries = [
        ...this.selectedSeries.filter((x) => x.id !== seriesId)
      ];
      this.onSeriesInput();
    },
    onSeriesInput: function() {
      const seriesIds = this.selectedSeries.map((x) => x.id);
      this.onInput(seriesIds, 'series');
    },
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(this, 'rankingsPaged', 'RankingPage');
    },
    formatForRankingCard: function(item) {
      return {
        ...item.ranking,
        character: {
          ...item
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.page-rankings {
  display: flex;

  &__column {
    flex: 1;
    margin: 0 10px;
  }
}
</style>
