<template>
  <label :for="id" :aria-checked="checked" class="radio">
    <input
      :id="id"
      :name="name"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      type="radio"
      class="radio__input"
      @change="onChange"
    />
    <span>{{ text }}</span>
  </label>
</template>

<script>
export default {
  name: 'RadioButton',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      required: true
    },
    checked: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChange: function (event) {
      const { value } = event.target;
      this.$emit('change', value, this.name);
    }
  }
};
</script>

<style lang="scss" scoped>
.radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &__input {
    appearance: none;
    padding-right: 2px;
    margin: 0;
    pointer-events: none;

    &::after {
      content: '\25ef';
      color: #aaa;
      font-size: 1.2rem;
      vertical-align: middle;
    }

    &:checked::after {
      content: '\25c9';
      color: inherit;
      font-size: 1.5rem;
    }

    &[disabled]::after,
    &[disabled] + span {
      color: #bbb !important;
    }
  }
}
</style>
