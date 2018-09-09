<template>
    <button
        :class="buttonClasses"
        :type="type"
        :icon="icon"
        :disabled="disabled"
        @click="onClick"
    >
        <slot></slot>
    </button>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'Button',
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
    }
  },
  computed: {
    buttonClasses: function() {
      return classNames(
        'button',
        {
          'themed-background': this.theme !== 'default',
          'themed-background--reversed': this.theme === 'secondary',
          'button--icon': !!this.icon,
          [`button--size_${this.size}`]: !!this.size,
          'button--rounded': this.rounded,
          'button--depress': this.depress
        },
        'ripple',
        this.className
      );
    }
  },
  methods: {
    onClick: function(event) {
      this.$emit('click', event);
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../../styles/_variables';

.button {
  appearance: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: inherit;
  color: inherit;
  padding: 5px;
  border: none;
  white-space: nowrap;
  cursor: pointer;
  min-width: 100px;
  min-height: 25px;
  text-decoration: none;

  &--size_small {
    min-width: 30px;
    max-width: 50px;
  }

  &--rounded {
    border-radius: 5px;
  }
  &--depress {
    box-shadow: 0 0 5px $onyx;
    &:active {
      box-shadow: inset 0px 0px 5px $onyx;
    }
  }
  &:disabled {
    background-color: $grey80 !important;
    color: $grey40 !important;
    cursor: default;
  }
}

.button--link {
  color: $anchor--colour;
  text-decoration: underline;

  &:focus,
  &:active {
    color: $anchor--colour;
  }
  &:hover {
    color: $anchor--colour-hover;
  }
}

.button--icon {
  flex: 0 1 0%;
  padding: 3px 6px;
  margin: 2px 5px;
  text-decoration: none;

  &:before {
    content: attr(icon);
    font-size: 1.5rem;

    &:not(:disabled) {
      cursor: pointer;
    }
  }

  &.button--size_small:before {
    font-size: 0.8rem;
  }
}
</style>
<style lang="scss" scoped>
@import '../../styles/_variables';

.vote-button {
  width: 100%;
  margin: auto;

  &--has-winner .vote-button__vote-text {
    visibility: hidden;
  }

  &--is-winner::before {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: $app--success-background-colour;
    color: $app--success-colour;
    font-size: 1em;
  }
}
</style>