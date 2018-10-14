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
          :value="getType()"
          :options="mappedTypes"
          @change="onInput"
        />
      </div>
    </ListFilterBar>
    <List 
      wrap
      align-left
      fixed-width
      columns="three"
      :items="htrInstancesPaged.nodes"
      :paged-total="htrInstancesPaged.total"
      @intersect="showMore"
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
import * as Routing from '@/utils/routing';

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
        search: ''
        // type: GET FROM QUERY ARG
      },
      htrInstancesPaged: defaultPagedResponse()
    };
  },
  apollo: {
    htrInstancesPaged: {
      query: Query.getHTRInstancesByType,
      variables: {
        search: '',
        type: Routing.getQueryFromLocation('type', HTRTemplateTypes.list),
        paging: {
          page: 0,
          size: LP.size
        }
      }
    }
  },
  methods: {
    getType: function() {
      return Routing.getQuery(this.$router, 'type') || HTRTemplateTypes.list;
    },
    onAdd: function() {
      this.$router.push(
        Urls.build(Urls.htrInstanceCreate, { type: this.getType() })
      );
    },
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(this, 'htrInstancesPaged', 'HTRInstancePage');
    }
  }
};
</script>
