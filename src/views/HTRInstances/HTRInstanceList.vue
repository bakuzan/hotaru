<template>
  <div class="page">
    <ListFilterBar 
      v-bind="filters"
      @input="onInput"
      @add="onAdd"
    >
      <div :slot="typeSlotName">
        <RadioButtonGroup
          id="type"
          name="type"
          column
          :value="filters.type"
          :options="mappedTypes"
          @change="onInput"
        />
      </div>
    </ListFilterBar>
    <List 
      wrap
      columns="four"
      :items="htrInstances"
    >
      <template slot-scope="slotProps">
        <LinkCard 
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
import { LinkCard } from '@/components/Cards';
import MultiSelect from '@/components/MultiSelect';
import RadioButtonGroup from '@/components/RadioButtonGroup';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import HTRTemplateType, {
  HTRTemplateTypes
} from '@/constants/htr-template-type';
import { Query } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import { mapEnumToRadioButtonGroup } from '@/utils/mappers';
import * as LP from '@/utils/list-pages';

export default {
  name: 'HTRInstanceList',
  components: {
    List,
    ListFilterBar,
    LinkCard,
    MultiSelect,
    RadioButtonGroup
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType,
      cardUrl: Urls.htrInstanceView,
      mappedTypes: mapEnumToRadioButtonGroup(HTRTemplateType),
      filterHandler: LP.updateFilterAndRefetch(this, 'htrInstancesPaged'),
      searchTimer: null,
      filters: {
        search: '',
        type: HTRTemplateTypes.list
      },
      page: 0,
      htrInstancesPaged: defaultPagedResponse()
    };
  },
  apollo: {
    htrInstancesPaged: {
      query: Query.getHTRInstancesByType,
      debounce: 1000,
      variables: {
        search: '',
        type: HTRTemplateTypes.list,
        paging: {
          page: 0,
          size: LP.size
        }
      }
    }
  },
  methods: {
    onAdd: function() {
      this.$router.push(
        Urls.build(Urls.htrInstanceCreate, { type: this.filters.type })
      );
    },
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(this, 'htrInstancesPaged');
    }
  }
};
</script>
