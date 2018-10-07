<template>
  <div class="page">
    <ListFilterBar 
      v-bind="filters"
      @input="onInput"
      @add="onAdd"
    >
      <MultiSelect 
        :slot="typeSlotName"
        id="gender"
        name="genders"
        label="genders"
        :values="filters.genders"
        :options="mappedGenders"
        @update="onInput"
      />
    </ListFilterBar>
    <List 
      id="character-list"
      wrap
      columns="four"
      className="characters"
      itemClassName="characters__item"
      :items="charactersPaged.nodes"
      :paged-total="charactersPaged.total"
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
import GenderType from '@/constants/gender-type';
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
      filterHandler: LP.updateFilterAndRefetch(this, 'charactersPaged'),
      searchTimer: null,
      filters: {
        search: '',
        genders: [...GenderType]
      },
      charactersPaged: defaultPagedResponse()
    };
  },
  apollo: {
    charactersPaged: {
      query: Query.getCharactersPaged,
      variables: {
        search: '',
        genders: [...GenderType],
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
