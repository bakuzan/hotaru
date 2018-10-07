<template>
  <Button
    v-bind="$props"
    theme="primary"
    :className="buttonClasses"
    :icon="maybeIcon"
    :disabled="hasWinner || disabled"
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
    disabled: {
      type: Boolean,
      default: false
    },
    hasWinner: {
      type: Boolean,
      default: false
    },
    isWinner: {
      type: Boolean,
      default: false
    },
    isChampion: {
      type: Boolean,
      default: false
    },
    showLostColour: {
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
          'vote-button--is-winner': this.isWinner,
          'vote-button--has-lost':
            this.hasWinner && !this.isWinner && this.showLostColour,
          'vote-button--is-champion': this.isChampion,
          'vote-button--is-disabled': this.disabled
        },
        this.className
      );
    },
    maybeIcon: function() {
      return this.isChampion
        ? Icons.trophy
        : this.isWinner
          ? Icons.tick
          : this.hasWinner && this.showLostColour
            ? Icons.cross
            : null;
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

<style lang="scss">
@import '../../styles/_variables';
@import '../../styles/_extensions';

.vote-button {
  width: 100%;
  margin: auto;

  &--has-winner .vote-button__vote-text,
  &--is-disabled .vote-button__vote-text {
    visibility: hidden;
  }

  &--is-winner,
  &--is-champion,
  &--has-lost {
    &::before {
      @extend %center-contents;
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  &--has-lost::before {
    background-color: $app--failure-background-colour;
    color: $app--failure-colour;
  }
  &--is-winner::before {
    background-color: $app--success-background-colour;
    color: $app--success-colour;
  }
  &--is-champion::before {
    background-color: $app--champion-background-colour;
    color: $app--champion-colour;
  }
}
</style>
