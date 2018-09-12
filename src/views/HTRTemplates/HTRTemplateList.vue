<template>
  <div class="page">
    <ListFilterBar 
      v-bind="filters"
      @input="onInput"
      @add="onAdd"
    >
      <div :slot="typeSlotName">
          RADIO HERE
      </div>
    </ListFilterBar>
    <List 
      wrap
      columns="four"
      :items="htrTemplates"
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

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import HTRTemplateType, {
  HTRTemplateTypes
} from '@/constants/htr-template-type';
import { Query } from '@/graphql';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';

export default {
  name: 'HTRTemplateList',
  components: {
    List,
    ListFilterBar,
    LinkCard,
    MultiSelect
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType,
      cardUrl: Urls.htrTemplateEditor,
      searchTimer: null,
      filters: {
        search: '',
        type: HTRTemplateTypes.list
      },
      htrTemplates: []
    };
  },
  apollo: {
    htrTemplates: {
      query: Query.getHTRTemplatesByType,
      debounce: 1000,
      variables() {
        return { ...this.filters };
      }
    }
  },
  computed: {
    mappedTypes: function() {
      return mapEnumToSelectBoxOptions(HTRTemplateType);
    }
  },
  methods: {
    onInput: function(value, name) {
      this.filters[name] = value;
    },
    onAdd: function() {
      this.$router.push(Urls.htrTemplateCreator);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>