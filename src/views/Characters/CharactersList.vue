<template>
  <div class="page">
    <ListFilterBar v-bind="filters" @input="onInput" @add="onAdd">
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
    </ListFilterBar>
    <List
      id="character-list"
      :items="charactersPaged.nodes"
      :paged-total="charactersPaged.total"
      class="characters"
      item-class-name="characters__item"
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
import GenderType from '@/constants/genderType';
import SourceType from '@/constants/sourceType';
import { Query } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';
import * as LP from '@/utils/list-pages';

export default {
  name: 'CharactersList',
  components: {
    List,
    ListFilterBar,
    ListFigureCard,
    MultiSelect
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType,
      cardUrl: Urls.characterView,
      mappedGenders: mapEnumToSelectBoxOptions(GenderType),
      mappedSources: mapEnumToSelectBoxOptions(SourceType),
      filterHandler: LP.updateFilterAndRefetch(this, 'charactersPaged'),
      searchTimer: null,
      filters: {
        search: '',
        genders: [...GenderType],
        sources: [...SourceType]
      },
      charactersPaged: defaultPagedResponse()
    };
  },
  metaInfo: {
    title: 'Hotaru - Character List'
  },
  apollo: {
    charactersPaged: {
      query: Query.getCharactersPaged,
      variables: {
        search: '',
        genders: [...GenderType],
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
      this.$router.push(Urls.characterCreate);
    },
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(this, 'charactersPaged', 'CharacterPage');
    }
  }
};
</script>
