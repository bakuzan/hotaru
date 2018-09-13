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
import { mapEnumToRadioButtonGroup } from '@/utils/mappers';

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
      searchTimer: null,
      filters: {
        search: '',
        type: HTRTemplateTypes.list
      },
      htrInstances: []
    };
  },
  apollo: {
    htrInstances: {
      query: Query.getHTRInstancesByType,
      debounce: 1000,
      variables() {
        return { ...this.filters };
      }
    }
  },
  computed: {
    mappedTypes: function() {
      return mapEnumToRadioButtonGroup(HTRTemplateType);
    }
  },
  methods: {
    onInput: function(value, name) {
      this.filters[name] = value;
    },
    onAdd: function() {
      this.$router.push(
        Urls.build(Urls.htrInstanceCreate, { type: this.filters.type })
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
