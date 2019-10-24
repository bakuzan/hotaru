<template>
  <div class="page">
    <ListFilterBar v-bind="filters" @input="onInput" @add="onAdd">
      <div :slot="typeSlotName">
        <RadioButtonGroup
          id="type"
          :value="queryType"
          :options="mappedTypes"
          name="type"
          column
          @change="onInput"
        />
      </div>
    </ListFilterBar>
    <List
      :items="htrInstancesPaged.nodes"
      :paged-total="htrInstancesPaged.total"
      is-grid="standard"
      @intersect="showMore"
    >
      <template slot-scope="slotProps">
        <LinkCard v-bind="slotProps.item" :url-source="cardUrl" />
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
import HTRTemplateType, { HTRTemplateTypes } from '@/constants/htrTemplateType';
import { Query } from '@/graphql';
import { defaultPagedResponse } from '@/utils/models';
import { mapEnumToRadioButtonGroup } from '@/utils/mappers';
import * as LP from '@/utils/list-pages';
import * as Routing from '@/utils/routing';

const queryFilterOptions = {
  queryParam: 'type',
  queryDefault: HTRTemplateTypes.bracket
};
const defaultPage = {
  page: 0,
  size: LP.size
};

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
      title: queryFilterOptions.queryDefault,
      typeSlotName: Strings.slot.listFilterType,
      cardUrl: Urls.htrInstanceView,
      mappedTypes: mapEnumToRadioButtonGroup(HTRTemplateType),
      searchTimer: null,
      filters: {
        search: ''
        // type -> From query params
      },
      htrInstancesPaged: defaultPagedResponse(),
      filterHandler: LP.updateFilterAndRefetch(
        this,
        'htrInstancesPaged',
        queryFilterOptions
      )
    };
  },
  metaInfo() {
    return {
      title: this.title,
      titleTemplate: '%s Instance List | Hotaru'
    };
  },
  apollo: {
    htrInstancesPaged() {
      const queryType = Routing.getQueryFromLocation(
        'type',
        queryFilterOptions.queryDefault
      );

      return {
        query: Query.getHTRInstancesByType,
        variables: {
          search: '',
          type: queryType,
          paging: defaultPage
        }
      };
    }
  },
  computed: {
    queryType: function() {
      return Routing.getQueryArg(
        this.$router,
        'type',
        queryFilterOptions.queryDefault
      );
    }
  },
  watch: {
    $route: function() {
      this.title = Routing.getQueryFromLocation(
        'type',
        queryFilterOptions.queryDefault
      );

      LP.refetchForFilter(this, 'htrInstancesPaged', queryFilterOptions);
    }
  },
  methods: {
    onAdd: function() {
      const queryType = Routing.getQueryArg(
        this.$router,
        'type',
        queryFilterOptions.queryDefault
      );
      this.$router.push(
        Urls.build(Urls.htrInstanceCreate, { type: queryType })
      );
    },
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(
        this,
        'htrInstancesPaged',
        'HTRInstancePage',
        queryFilterOptions
      );
    }
  }
};
</script>
