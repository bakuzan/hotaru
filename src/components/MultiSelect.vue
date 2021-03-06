<template>
  <div class="multi-select">
    <div class="multi-select__display display has-float-label">
      <input
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :value="displayValue"
        type="text"
        autocomplete="off"
        class="display__input"
        tabindex="0"
        readonly
        @click="handleToggleOpen"
        @keydown="handleToggleOpen"
      />
      <label :for="id">{{ label }}</label>
    </div>
    <div
      v-htr-outside-click="handleToggleClose"
      :aria-hidden="!isOpen"
      :class="dropdownClasses"
    >
      <TabTrap
        :is-active="isOpen"
        :first-id="selectAllName"
        :last-id="lastElementId"
        element="ul"
        class="multi-select__list"
        @deactivate="onTabTrapDeactivate"
      >
        <li>
          <Tickbox
            :id="selectAllName"
            :name="selectAllName"
            :checked="hasAllSelected"
            text="Select All"
            @change="handleSelectAll"
          />
        </li>
        <li class="multi-select__separator" />
        <li v-for="(op, i) in options" :key="op.value">
          <Tickbox
            :id="getName(i)"
            :name="getName(i)"
            :text="op.text"
            :checked="values.includes(op.value)"
            @change="handleOptionChange"
          />
        </li>
      </TabTrap>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';

import Tickbox from '@/components/Tickbox';
import TabTrap from '@/components/TabTrap';

import { OutsideClick } from '@/directives/OutsideClick';
import Strings from '@/constants/strings';
import { OPEN_KEYS } from '@/constants/keyCodes';

const EXTRACT_OPTION_INDEX = /^.*-/g;
const OPTION_PREFIX = 'option-';
const ALL_SELECTED_TEXT = 'All Selected';

export default {
  name: 'MultiSelect',
  components: {
    Tickbox,
    TabTrap
  },
  directives: {
    OutsideClick
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'MultiSelect'
    },
    placeholder: {
      type: String,
      default: 'None selected'
    },
    values: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    listClassName: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      removeOutsideClick: null,
      selectAllName: `${this.id}--selectAll`,
      isOpen: false
    };
  },
  computed: {
    lastElementId: function () {
      const lastIndex = this.options.length - 1;
      return this.getName(lastIndex);
    },
    dropdownClasses: function () {
      return classNames(
        'multi-select__dropdown-container',
        { 'multi-select__dropdown-container--is-open': this.isOpen },
        this.listClassName
      );
    },
    displayValue: function () {
      const length = this.values.length;

      if (!length) {
        return '';
      } else if (length === this.options.length) {
        return ALL_SELECTED_TEXT;
      } else if (length === 1) {
        return this.options.find((x) => this.values.includes(x.value)).text;
      }

      return `${length} selected`;
    },
    hasAllSelected: function () {
      return this.values.length === this.options.length;
    }
  },
  methods: {
    getName: function (i) {
      return `${this.id}--${OPTION_PREFIX}${i}`;
    },
    handleToggleOpen: function (e) {
      if (e.type !== Strings.events.click && !OPEN_KEYS.includes(e.key)) {
        return;
      }

      if (this.disabled) {
        return;
      }

      e.stopPropagation();
      this.isOpen = true;
    },
    handleToggleClose: function () {
      this.isOpen = false;
    },
    handleOptionChange: function (_, name) {
      const index = Number(name.replace(EXTRACT_OPTION_INDEX, ''));
      const option = this.options.find((x, i) => i === index);
      const valuesSet = new Set([...this.values]);
      const hasValue = valuesSet.has(option.value);

      if (hasValue) {
        valuesSet.delete(option.value);
        this.$emit('update', [...valuesSet.values()], this.name);
      } else {
        valuesSet.add(option.value);
        this.$emit('update', [...valuesSet.values()], this.name);
      }
    },
    handleSelectAll: function () {
      const values = new Set([...this.values]);
      const options = new Set([...this.options.map((op) => op.value)]);
      const hasAllSelected = values.size === options.size;
      const newValues = hasAllSelected ? [] : [...options.values()];
      this.$emit('update', newValues, this.name);
    },
    onTabTrapDeactivate: function () {
      const input = document.getElementById(this.id);

      if (input) {
        requestAnimationFrame(() => input.focus());
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';
@import '../styles/_extensions';

$full-size-minus-padding: calc(100% - 10px);

.multi-select {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 100px;
  min-height: 25px;
  border: none;

  &__display {
    padding: 5px;
    min-height: 35px;
    margin-bottom: -3px; // dont know why it doesnt line up
    box-sizing: content-box;
    cursor: pointer;

    &::after {
      @extend %down-caret-rhs;
    }
  }

  &__list {
    padding: $app--padding-standard;
    margin: $app--margin-standard 0;
    width: 100%;
    list-style-type: none;
    z-index: map-get($z-index, above-siblings);
  }

  &__separator {
    height: 1px;
    border-bottom: 1px solid;
    opacity: 0.2;
  }

  &__dropdown-container {
    position: absolute;
    top: $full-size-minus-padding;
    display: none;
    width: $full-size-minus-padding;
    @extend %standard-shadow;
    z-index: map-get($z-index, above-siblings);

    &--is-open {
      display: flex;
    }
  }
}
.display__input {
  display: flex;
  flex: 1 0 100%;
  color: inherit;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
