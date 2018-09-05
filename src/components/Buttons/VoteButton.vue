<template>
  <Button
    v-bind="$props"
    theme="primary"
    :className="buttonClasses"
    :icon="maybeWinningIcon"
    :disabled="hasWinner"
    @click="handleClick"
  >
    <span class="vote-button__vote-text">
      <slot></slot>
    </span>
  </Button>
</template>

<script>
import classNames from 'classnames';

import Button from './Button';
import Icons from '@/constants/icons';

export default {
  name: 'VoteButton',
  components: {
    Button
  },
  props: {
    id: String,
    className: String,
    type: {
      type: String,
      default: 'button'
    },
    icon: String,
    theme: {
      type: String,
      default: 'default',
      validator: function(value) {
        return ['default', 'primary', 'secondary'].includes(value);
      }
    },
    size: {
      type: String,
      default: null,
      validator: function(value) {
        return ['small'].includes(value);
      }
    },
    rounded: Boolean,
    depress: Boolean,
    hasWinner: {
      type: Boolean,
      default: false
    },
    isWinner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses: function() {
      return classNames(
        'vote-button',
        {
          'vote-button--has-winner': this.hasWinner,
          'vote-button--is-winner': this.isWinner
        },
        this.className
      );
    },
    maybeWinningIcon: function() {
      return this.isWinner ? Icons.tick : null;
    }
  },
  methods: {
    handleClick: function(...things) {
      if (this.hasWinner) return;

      this.$emit('click', ...things);
    }
  }
};
</script>
