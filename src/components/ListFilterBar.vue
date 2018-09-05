<template>
    <div class="list-filter">
        <InputBox 
            class="list-filter__search"
            label="search"
            :value="search" 
            @input="onInput" 
        />
        <slot :name="typeSlotName"></slot>
        <Button
            class-name="list-filter__add-button"
            theme="primary"
            size="small"
            @click="onClick"
        >
            Add
        </Button>
    </div>
</template>

<script>
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';

import Strings from '@/constants/strings';

export default {
  name: 'ListFilterBar',
  components: {
    InputBox,
    Button
  },
  props: {
    search: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType
    };
  },
  computed: {},
  methods: {
    onInput: function(value, name) {
      this.$emit('input', value, name);
    },
    onClick: function() {
      this.$emit('add');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/_extensions.scss';

.list-filter {
  display: flex;

  &__add-button {
    margin: $app--margin-standard;
    box-sizing: content-box;
  }
}
</style>
