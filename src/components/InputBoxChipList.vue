<template>
  <div :class="classes">
    <InputBoxAutocomplete 
      v-bind="$props" 
      :filter="filter"
      :input-props="clearableInputProps"
      @input="onInput"
      @on-select="onSelect"
      @keydown="onKeyDown"
    />
    <div v-show="hasChips" class="chip-list__selected-outer">
      <div class="chip-list__selected-inner">
        <InputBoxChipListTag
          v-for="(tag, index) in values"
          :key="tag.id"
          :is-active="isActiveTag(index)"
          :data="tag"
          has-remove
          @remove="removeInputItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';

import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import InputBoxChipListTag from '@/components/InputBoxChipListTag';

import KeyCodes from '@/constants/key-codes';

export default {
  name: 'InputBoxChipList',
  components: {
    InputBoxAutocomplete,
    InputBoxChipListTag
  },
  props: {
    label: {
      type: String,
      default: 'tags'
    },
    attr: {
      type: String,
      default: 'name'
    },
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      required: true
    },
    disableLocalFilter: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      filter: '',
      readyRemoval: false
    };
  },
  computed: {
    classes: function() {
      return classNames('chip-list', {});
    },
    hasChips: function() {
      return !!this.values.length;
    },
    clearableInputProps: function() {
      return {
        class: 'chip-list__clearable-input'
      };
    }
  },
  methods: {
    isActiveTag: function(index) {
      return this.readyRemoval && index === this.values.length - 1;
    },
    onInput: function(value) {
      this.filter = value;
      this.readyRemoval = false;
    },
    onSelect: function(id) {
      const item = this.options.find((x) => x.id === id);
      if (!item) return this.$emit('create-new', item);

      const alreadyExists = this.values.find((x) => x.id === item.id);
      if (alreadyExists) return;

      this.filter = '';
      this.$nextTick(() => this.updateList(item));
    },
    onKeyDown: function(event) {
      const { keyCode } = event;
      if (keyCode === KeyCodes.backspace && !this.filter) {
        event.preventDefault();
        if (!this.readyRemoval) return this.setStateRemoval(true);
        if (this.readyRemoval) return this.removeLastInputItem();
      }
    },
    persistListState: function(list) {
      this.$emit('update', list, this.name);
      this.setStateRemoval(false);
    },
    updateList: function(item) {
      const list = [...this.values, item];
      this.persistListState(list);
    },
    removeInputItem: function(data) {
      const { id } = data;
      const list = this.values.filter((x) => x.id !== id);
      this.persistListState(list);
    },
    removeLastInputItem: function() {
      const list = this.values.slice(0, this.values.length - 1);
      this.persistListState(list);
    },
    setStateRemoval: function(value) {
      this.readyRemoval = value;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';

.chip-list {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  align-items: flex-end;
  padding-top: 1em !important;

  &__clearable-input {
    padding-left: 0;
  }

  &__selected-outer {
    padding: $app--padding-standard 0;
    margin-bottom: 1px;
  }

  &__selected-inner {
    display: inline-flex;
    flex-wrap: wrap;
    min-height: 36px;
    max-width: 400px;
    padding: 0 $app--padding-small;
    border: 0;
    border-radius: 0;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
