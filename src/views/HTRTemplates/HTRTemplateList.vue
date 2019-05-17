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
      :items="htrTemplatesPaged.nodes"
      :paged-total="htrTemplatesPaged.total"
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

export default {
  name: 'HTRTemplateList',
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
      cardUrl: Urls.htrTemplateEditor,
      mappedTypes: mapEnumToRadioButtonGroup(HTRTemplateType),
      searchTimer: null,
      filters: {
        search: ''
        // type -> From query params
      },
      htrTemplatesPaged: defaultPagedResponse(),
      filterHandler: LP.updateFilterAndRefetch(
        this,
        'htrTemplatesPaged',
        queryFilterOptions
      )
    };
  },
  metaInfo() {
    return {
      title: this.title,
      titleTemplate: 'Hotaru - %s Template List'
    };
  },

  apollo: {
    htrTemplatesPaged() {
      const queryType = Routing.getQueryFromLocation(
        'type',
        queryFilterOptions.queryDefault
      );

      return {
        query: Query.getHTRTemplatesByType,
        variables: {
          search: '',
          type: queryType,
          paging: {
            page: 0,
            size: LP.size
          }
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

      LP.refetchForFilter(this, 'htrTemplatesPaged', queryFilterOptions);
    }
  },
  methods: {
    onAdd: function() {
      this.$router.push(Urls.htrTemplateCreator);
    },
    onInput: function(value, name) {
      this.filterHandler(value, name);
    },
    showMore: function() {
      LP.showMore(
        this,
        'htrTemplatesPaged',
        'HTRTemplatePage',
        queryFilterOptions
      );
    }
  }
};
</script>
