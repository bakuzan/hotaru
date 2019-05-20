<template>
  <div :class="classes">
    <InputBox
      id="search"
      :value="search"
      class="list-filter__search"
      name="search"
      label="search"
      @input="onInput"
    />
    <slot :name="typeSlotName"></slot>
    <Button
      v-if="!hideAdd"
      class-name="list-filter__add-button"
      theme="primary"
      size="small"
      @click="onClick"
      >Add</Button
    >
  </div>
</template>

<script>
import classNames from 'classnames';
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
    },
    hideAdd: {
      type: Boolean,
      default: false
    },
    column: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      typeSlotName: Strings.slot.listFilterType
    };
  },
  computed: {
    classes: function() {
      return classNames('list-filter', {
        'list-filter--column': this.column
      });
    }
  },
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

  &--column {
    flex-direction: column;

    > * {
      margin: 5px 0;
    }
  }

  &__add-button {
    margin: $app--margin-standard;
    box-sizing: content-box;
  }
  &__search {
    max-height: 45px;
  }
}
</style>
