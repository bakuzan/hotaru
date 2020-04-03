<template>
  <div :class="classes">
    <RadioButton
      v-for="(item, i) in options"
      :id="getKey(i)"
      :key="item.value"
      :name="name"
      v-bind="item"
      :checked="item.value === value"
      @change="onChange"
    />
  </div>
</template>

<script>
import classNames from 'classnames';

import RadioButton from '@/components/RadioButton';

export default {
  name: 'RadioButtonGroup',
  components: {
    RadioButton
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      required: true
    },
    options: {
      type: Array,
      default: () => []
    },
    column: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes: function () {
      return classNames('radio-button-group', {
        'radio-button-group--column': this.column
      });
    }
  },
  methods: {
    getKey: function (i) {
      return `${this.id}-${i}`;
    },
    onChange: function (value, name) {
      this.$emit('change', value, name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';

.radio-button-group {
  display: flex;
  padding: $app--padding-standard;

  &--column {
    flex-direction: column;
  }
}
</style>
