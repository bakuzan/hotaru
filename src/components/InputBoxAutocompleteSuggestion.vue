<template>
  <li :class="classes">
    <Button :title="itemText" class="suggestion__button" @click="onClick">
      <span class="suggestion__text">
        <span>{{ textPart.pre }}</span>
        <span class="highlight">{{ textPart.highlight }}</span>
        <span>{{ textPart.post }}</span>
      </span>
    </Button>
  </li>
</template>

<script>
import classNames from 'classnames';

import { Button } from '@/components/Buttons';

export default {
  name: 'InputBoxAutocompleteSuggestion',
  components: {
    Button
  },
  props: {
    activeSuggestion: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    attr: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    highlightMatch: {
      type: Function,
      required: true
    }
  },
  data: function() {
    return {};
  },
  computed: {
    classes: function() {
      return classNames('suggestion', {
        'suggestion--active': this.isActiveSuggestion
      });
    },
    isActiveSuggestion: function() {
      return this.activeSuggestion === this.index;
    },
    itemText: function() {
      return this.item[this.attr];
    },
    textPart: function() {
      return this.highlightMatch(this.itemText);
    }
  },
  methods: {
    onClick: function() {
      this.$emit('on-select', this.item.id);
    }
  }
};
</script>
