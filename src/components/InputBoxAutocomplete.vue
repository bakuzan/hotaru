<template>
  <div :class="classes">
    <InputBox 
      v-bind="$props"
      :class="inputProps.class"
      :value="filter"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <portal :to="portalTarget" v-if="portalMenu">
      <ul
        v-show="hasSuggestions"
        :class="menuClasses"
      >
        <InputBoxAutocompleteSuggestion
          v-for="(item, index) in suggestions"
          :key="item.id"
          :active-suggestion="activeSuggestion"
          :index="index"
          :attr="attr"
          :item="item"
          @on-select="onSelectAutocompleteSuggestion"
          :highlight-match="highlightMatchingText"
        />
      </ul>
      <ul
        v-show="showNoSuggestionsText"
        :class="menuClasses"
      >
        <li
          class="suggestion suggestion--active"
        >
          <div>No suggestions available</div>
        </li>
      </ul>
    </portal>
      <ul
        v-if="!portalMenu"
        v-show="hasSuggestions"
        :class="menuClasses"
      >
        <InputBoxAutocompleteSuggestion
          v-for="(item, index) in suggestions"
          :key="item.id"
          :active-suggestion="activeSuggestion"
          :index="index"
          :attr="attr"
          :item="item"
          @on-select="onSelectAutocompleteSuggestion"
          :highlight-match="highlightMatchingText"
        />
      </ul>
      <ul
        v-if="!portalMenu"
        v-show="showNoSuggestionsText"
        :class="menuClasses"
      >
        <li
          class="suggestion suggestion--active"
        >
          <div>No suggestions available</div>
        </li>
      </ul>
  </div>
</template>

<script>
import classNames from 'classnames';

import InputBox from '@/components/InputBox';
import InputBoxAutocompleteSuggestion from '@/components/InputBoxAutocompleteSuggestion';

import KeyCodes from '@/constants/key-codes';
import Strings from '@/constants/strings';

export default {
  name: 'InputBoxAutocomplete',
  components: {
    InputBox,
    InputBoxAutocompleteSuggestion
  },
  props: {
    label: {
      type: String
    },
    name: {
      type: String
    },
    attr: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    filter: {
      type: String,
      required: true
    },
    disableLocalFilter: {
      type: Boolean,
      default: false
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    inputProps: {
      type: Object,
      default: () => ({ class: '' })
    },
    disabled: {
      type: Boolean
    },
    menuClass: {
      type: String
    },
    portalMenu: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      isFocussed: false,
      activeSuggestion: 0,
      timer: null,
      portalTarget: Strings.portal.naviMenu
    };
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  computed: {
    classes: function() {
      return classNames('autocomplete', {
        'autocomplete--no-suggestions': this.showNoSuggestionsText
      });
    },
    menuClasses: function() {
      return classNames(
        'autocomplete__menu',
        'list column one',
        this.menuClass
      );
    },
    showMenu: function() {
      const focussedWithFilter = this.isFocussed && this.filter;
      return focussedWithFilter;
    },
    hasOptions: function() {
      return !!this.options.length;
    },
    showNoSuggestionsText: function() {
      return (
        this.showMenu &&
        !this.hasSuggestions &&
        (this.hasOptions || this.disableLocalFilter)
      );
    },
    suggestions: function() {
      const { options, attr, filter, disableLocalFilter } = this;

      if (!(options && filter)) return [];
      if (disableLocalFilter) return options;

      const filterLowerCase = filter.toLowerCase();
      return options.filter(
        (x) => x[attr].toLowerCase().indexOf(filterLowerCase) > -1
      );
    },
    hasSuggestions: function() {
      return !!this.suggestions.length && this.showMenu;
    }
  },
  methods: {
    onInput: function(value, name) {
      this.$emit('input', value, name);
      this.activeSuggestion = 0;
    },
    onKeyDown: function(event) {
      const { keyCode } = event;
      if (keyCode === KeyCodes.enter && this.filter) {
        event.preventDefault();
        this.selectActiveSuggestion();
      } else if (keyCode === KeyCodes.down) {
        this.updateActiveSuggestion(1);
      } else if (keyCode === KeyCodes.up) {
        this.updateActiveSuggestion(-1);
      } else {
        this.$emit('keydown', event);
      }
    },
    onFocus: function() {
      clearTimeout(this.timer);
      this.isFocussed = true;
    },
    onBlur: function() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!this.timer) return;
        this.isFocussed = false;
      }, 1000);
    },
    onSelectAutocompleteSuggestion: function(id) {
      if (!id && id !== 0 && !this.allowCreate) return;
      this.$emit('on-select', id);
    },
    selectActiveSuggestion: function() {
      const item = this.suggestions[this.activeSuggestion];
      const id = item ? item.id : null;
      this.onSelectAutocompleteSuggestion(id);
    },
    updateActiveSuggestion: function(value) {
      const maxIndex = this.suggestions.length - 1;
      let newValue = this.activeSuggestion + value;
      if (newValue > maxIndex) newValue = 0;
      if (newValue < 0) newValue = maxIndex;
      this.activeSuggestion = newValue;
    },
    highlightMatchingText: function(value = '') {
      const match = value.match(new RegExp(this.filter, 'i'));
      if (!match) return value;

      const length = this.filter.length;
      const breakdown = {
        pre: value.slice(0, match.index),
        highlight: value.slice(match.index, match.index + length),
        post: value.slice(match.index + length)
      };

      return breakdown;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';

.autocomplete {
  position: relative;
  display: flex;
  flex: 1 1 100%;

  &--no-suggestions {
    .suggestion {
      text-align: center;
    }
  }
}

.autocomplete__menu {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  max-height: 250px;
  padding: 5px;
  margin: 0;
  overflow: auto;
  list-style-type: none;
  z-index: map-get($z-index, menu);
  box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.5);
  transform: translateY(100%);
}
</style>
<style lang="scss">
@import '../styles/_extensions';

.suggestion {
  @extend %standard-border;

  &__button {
    width: 100%;
  }
  &__text {
    display: flex;
    white-space: pre;
  }
}

.highlight {
  font-weight: bold;
}
</style>
