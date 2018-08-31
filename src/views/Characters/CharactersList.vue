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
      wrap
      columns="four"
      className="characters"
      itemClassName="characters__item"
      :items="characters"
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
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';

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
      searchTimer: null,
      filters: {
        search: '',
        genders: [...GenderType]
      },
      characters: []
    };
  },
  apollo: {
    characters: {
      query: Query.getCharacters,
      debounce: 1000,
      variables() {
        return { ...this.filters };
      }
    }
  },
  computed: {
    mappedGenders: function() {
      return mapEnumToSelectBoxOptions(GenderType);
    }
  },
  methods: {
    onInput: function(value, name) {
      this.filters[name] = value;
    },
    onAdd: function() {
      this.$router.push(Urls.characterCreate);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
