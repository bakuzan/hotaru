<template>
  <div :class="classes">
    <input
      :id="id"
      :type="type"
      :name="name"
      :value="value"
      :maxLength="maxLength"
      :disabled="disabled"
      class="input-box__input"
      placeholder=" "
      autocomplete="off"
      @input="handleChange"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <label :for="id" class="input-box__label">{{ label }}</label>
    <Button
      v-show="showClearButton"
      :class-name="clearClasses"
      :icon="icon"
      size="small"
      @click="clearAndFocusInput"
    />
    <span v-show="showCount" class="input-box__count">{{ countText }}</span>
  </div>
</template>

<script>
import classNames from 'classnames';

import { Button } from '@/components/Buttons';
import Icons from '@/constants/icons';
import { getEventValue } from '@/utils';

export default {
  name: 'InputBox',
  components: {
    Button
  },
  props: {
    id: { type: String, required: true },
    name: {
      type: String,
      default: 'search'
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: 'search'
    },
    value: {
      default: '',
      validator: function (value) {
        return typeof value === 'string' || typeof value === 'number';
      }
    },
    maxLength: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    clearButtonClass: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return { icon: Icons.cross, clearTimer: null };
  },
  computed: {
    showClearButton: function () {
      return !!this.value && this.isTextInput;
    },
    isTextInput: function () {
      return this.type === 'text';
    },
    classes: function () {
      const notClearable = !!this.isTextInput;

      return classNames(
        'input-box',
        'input-container',
        'has-float-label',
        {
          'input-box--not-clearable': notClearable
        },
        this.class
      );
    },
    clearClasses: function () {
      return classNames('input-box__clear', this.clearButtonClass);
    },
    hasMaxNumber: function () {
      return this.type === 'number' && !isNaN(this.max);
    },
    showCount: function () {
      return !!this.maxLength || this.hasMaxNumber;
    },
    countText: function () {
      if (this.maxLength) return `${this.value.length}/${this.maxLength}`;
      if (this.hasMaxNumber) return `out of ${this.max || '?'}`;
      return '';
    }
  },
  methods: {
    clearAndFocusInput: function () {
      this.$emit('input', '', this.name);

      clearTimeout(this.clearTimer);
      this.clearTimer = setTimeout(() => this.$el.firstChild.focus(), 100);
    },
    handleChange: function (event) {
      const { name } = event.target;
      const value = getEventValue(event.target);
      this.$emit('input', value, name);
    },
    onFocus: function (event) {
      this.$emit('focus', event);
    },
    onBlur: function (event) {
      this.$emit('blur', event);
    },
    onKeyDown: function (event) {
      this.$emit('keydown', event);
    }
  }
};
</script>

<style lang="scss">
input {
  background-color: inherit;
}

.input-container {
  flex: 1;
  padding: 5px;
  min-height: 35px;
  box-sizing: content-box;

  input[type='text'],
  input[type='number'],
  input[type='date'],
  input[type='url'] {
    width: 100%;
    box-sizing: border-box;
  }

  > button {
    max-height: 32px;
    margin: {
      top: auto;
      bottom: auto;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '../styles/_variables';

.input-box {
  &__label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 15px);
  }

  > input {
    display: flex;
    flex: 1 0 100%;
  }

  &:not(.input-box--not-clearable) > input {
    padding-right: 1.5em !important;
  }

  &__clear {
    position: relative;
    right: 30px;
  }

  &__count {
    position: absolute;
    right: 10px;
    bottom: -5px;
    top: auto;
    left: auto;
    font-size: 0.5rem;
  }

  input[type='date'] {
    &::-webkit-calendar-picker-indicator,
    &::-webkit-inner-spin-button {
      appearance: none;
      display: none;
    }
  }
}
</style>
