<template>
  <div :class="selectClasses">
    <select
      v-if="options.length"
      class="select-box__input"
      :id="id"
      :name="name"
      :value="value"
      :disabled="disabled"
      @change="handleChange"
    >
      <option v-if="allowNulls" :value="null" class="select-box__option">None</option>
      <option
        v-if="isRequiredWithNoValue"
        :value="null"
        class="select-box__option"
      >Please select a {{text}}</option>
      <option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        class="select-box__option"
      >{{item.text}}</option>
    </select>
    <label :for="id">{{text}}</label>
  </div>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'SelectBox',
  props: {
    id: String,
    name: String,
    text: String,
    value: {
      type: [String, Number]
    },
    options: {
      type: Array,
      default: () => []
    },
    allowNulls: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean
    }
  },
  computed: {
    selectClasses: function() {
      return classNames('select-box', 'has-float-label');
    },
    isRequiredWithNoValue: function() {
      return this.required && !this.value;
    }
  },
  methods: {
    handleChange: function(event) {
      this.$emit('on-select', event.target.value, this.name);
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_extensions';

.select-box {
  flex: 1;
  padding: 5px;
  min-height: 35px;
  box-sizing: content-box;

  &::after {
    @extend %down-caret-rhs;
  }

  &__input {
    width: 100%;
    background-color: inherit;
    color: inherit;
  }

  &__option {
    background-color: inherit;
    color: inherit;
  }
}
</style>
