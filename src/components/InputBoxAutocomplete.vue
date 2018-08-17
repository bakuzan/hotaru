<template>
  <div :class="classes">
      <InputBox 
        v-bind="$props"
        class="inputProps.class"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeyDown"
      />
      <ul
        :class="menuClasses"
      >
        <InputBoxAutocompleteSuggestion
            v-for="(item, index) in suggestions"
            :key="item.id"
            :activeSuggestion="activeSuggestion"
            :index="index"
            :attr="attr"
            :item="item"
            @on-select="onSelectAutocompleteSuggestion"
            :highlightMatch="highlightMatchingText"
        />
        <li
            v-show="showNoSuggestionsText"
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
    noSuggestionsItem: {
      type: Boolean,
      default: false
    },
    inputProps: {
      type: Object,
      default: () => ({ class: '' })
    }
  },
  data: function() {
    return { isUse: false, activeSuggestion: 0, timer: null };
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
      return classNames('autocomplete__menu', 'list column one');
    },
    hasOptions: function() {
      return !!this.options.length;
    },
    showNoSuggestionsText: function() {
      return (
        !this.hasSuggestions && (this.hasOptions || this.disableLocalFilter)
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
      return !!this.suggestions.length;
    }
  },
  methods: {
    onInput: function(value, name) {
      this.$emit('input', value, name);
      this.activeSuggestion = 0;
    },
    onKeyDown: function(event) {
      console.log(event, this);
      //   const { keyCode } = event;
      //   if (keyCode === Enums.keyCodes.enter && this.props.filter) {
      //     event.preventDefault();
      //     this.selectActiveSuggestion();
      //   } else if (keyCode === Enums.keyCodes.down) {
      //     this.updateActiveSuggestion(1);
      //   } else if (keyCode === Enums.keyCodes.up) {
      //     this.updateActiveSuggestion(-1);
      //   } else if (this.props.onKeyDown) {
      //     this.$emit('keydown', event);
      //   }
    },
    onFocus: function() {
      clearTimeout(this.timer);
      this.inUse = true;
    },
    onBlur: function() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!this.timer) return;
        this.inUse = false;
      }, 1000);
    },
    onSelectAutocompleteSuggestion: function(id) {
      if (!id && id !== 0 && !this.noSuggestionsItem) return;
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
      return {
        pre: value.slice(0, match.index),
        highlight: value.slice(match.index, match.index + length),
        post: value.slice(match.index + length)
      };
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

.suggestion {
  &__button {
    width: 100%;
  }
  &__text {
    white-space: pre-line;
  }
}

.highlight {
  font-weight: bold;
}
</style>
