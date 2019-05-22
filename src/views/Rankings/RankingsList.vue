<template>
  <div class="page page-rankings">
    <div class="page-rankings__column">
      <ListFilterBar v-bind="filters" column hide-add @input="onInput">
        <MultiSelect
          id="gender"
          :slot="typeSlotName"
          :values="filters.genders"
          :options="mappedGenders"
          name="genders"
          label="genders"
          @update="onInput"
        />
        <MultiSelect
          id="source"
          :slot="typeSlotName"
          :values="filters.sources"
          :options="mappedSources"
          name="sources"
          label="sources"
          @update="onInput"
        />
        <div :slot="typeSlotName">
          <InputBoxAutocomplete
            id="seriesFilter"
            :options="series"
            :filter="seriesFilter"
            name="seriesFilter"
            label="Series"
            attr="name"
            disable-local-filter
            @input="onSearchSeries"
            @on-select="onSelectSeries"
          />

          <List :items="selectedSeries" columns="one">
            <template slot-scope="slotProps">
              <SeriesCard v-bind="slotProps.item" @remove="onRemoveSeries" />
            </template>
          </List>
        </div>
        <DateRangePicker
          :slot="typeSlotName"
          :from-date="filters.fromDate"
          :to-date="filters.toDate"
          @change="onInput"
        />
      </ListFilterBar>
    </div>
    <List
      id="ranking-list"
      :items="rankingsPaged.nodes"
      :paged-total="rankingsPaged.total"
      fixed-width
      columns="one"
      class="ranked-characters page-rankings__column"
      item-class-name="ranked-characters__item"
      @intersect="showMore"
    >
      <template slot-scope="slotProps">
        <RankingCard v-bind="formatForRankingCard(slotProps.item)" />
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
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker';

import Strings from '@/constants/strings';
import GenderType from '@/constants/genderType';
import SourceType from '@/constants/sourceType';
import { Query } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';
import formatForRankingCard from '@/utils/formatForRankingCard';
import * as LP from '@/utils/list-pages';

export default {
  name: 'RankingsList',
  components: {
    List,
    ListFilterBar,
    RankingCard,
    SeriesCard,
    MultiSelect,
    InputBoxAutocomplete,
    DateRangePicker
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
        series: [],
        fromDate: new Date('2018-09-25'),
        toDate: new Date()
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
      return formatForRankingCard(item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';
@import '../../styles/_mixins';

.page-rankings {
  display: flex;

  &__column {
    flex: 1;
    max-width: 60%;
    margin: 0 8px;
  }

  @include respond-to(xs) {
    flex-direction: column;

    &__column {
      max-width: 100%;
      margin: 0;
    }
  }
}

.ranked-characters {
  min-width: 400px;
}
</style>
