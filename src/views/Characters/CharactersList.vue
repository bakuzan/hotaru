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
      :items="charactersPaged.nodes"
    >
      <template slot-scope="slotProps">
        <ListFigureCard 
          v-bind="slotProps.item" 
          :url-source="cardUrl" 
        />
      </template>
    </List>
    <button @click="showMore">show more temp button</button>
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
import {
  mapEnumToSelectBoxOptions,
  mapPagedResponseToUpdate
} from '@/utils/mappers';

const size = 10;
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
      page: 0,
      showMoreEnabled: true,
      charactersPaged: {
        nodes: [],
        total: 0
      }
    };
  },
  apollo: {
    charactersPaged: {
      query: Query.getCharactersPaged,
      debounce: 1000,
      variables: {
        search: '',
        genders: [...GenderType],
        paging: {
          page: 0,
          size
        }
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
      this.page = 0;

      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.$apollo.queries.charactersPaged.refetch({
          ...this.filters,
          paging: {
            page: this.page,
            size
          }
        });
      }, 1000);
    },
    onAdd: function() {
      this.$router.push(Urls.characterCreate);
    },
    showMore() {
      this.page++;
      this.$apollo.queries.charactersPaged.fetchMore({
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
