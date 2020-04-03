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
    className: { type: String, default: '' },
    type: {
      type: String,
      default: 'button'
    },
    icon: { type: String, default: '' },
    link: { type: Boolean, default: false },
    theme: {
      type: String,
      default: 'default',
      validator: function (value) {
        return ['default', 'primary', 'secondary'].includes(value);
      }
    },
    size: {
      type: String,
      default: null,
      validator: function (value) {
        return ['small'].includes(value);
      }
    },
    rounded: { type: Boolean, default: false },
    depress: { type: Boolean, default: false },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses: function () {
      return classNames(
        'button',
        {
          'themed-background': this.theme !== 'default',
          'themed-background--reversed': this.theme === 'secondary',
          'button--icon': !!this.icon,
          'button--link': !!this.link,
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
    onClick: function (event) {
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
