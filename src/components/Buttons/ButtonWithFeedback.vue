<template>
  <Button v-bind="$props" :class="buttonClasses" @click="handleClick">
    <LoadingBouncer local cirlce-class="feedback__bouncer" />
    <slot></slot>
  </Button>
</template>

<script>
import classNames from 'classnames';

import Button from './Button';
import LoadingBouncer from '@/components/LoadingBouncer';

export default {
  name: 'ButtonWithFeedback',
  components: {
    Button,
    LoadingBouncer
  },
  props: {
    id: {
      type: String,
      default: undefined
    },
    className: {
      type: String,
      default: undefined
    },
    type: {
      type: String,
      default: 'button'
    },
    icon: {
      type: String,
      default: undefined
    },
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
    updateState: {
      type: Function,
      required: true
    }
  },
  data: function () {
    return { isLoading: false, isSuccess: false, isFailure: false };
  },
  computed: {
    buttonClasses: function () {
      return classNames('feedback', {
        'feedback--state_loading': this.isLoading,
        'feedback--state_success': this.isSuccess,
        'feedback--state_failure': this.isFailure
      });
    }
  },
  created() {
    this.updateState(this.handleState);
  },
  methods: {
    handleClick: function (...things) {
      this.$emit('click', ...things);
    },
    handleState: function ({
      isLoading = false,
      isSuccess = false,
      isFailure = false
    }) {
      this.isLoading = isLoading;
      this.isSuccess = isSuccess;
      this.isFailure = isFailure;

      if (this.isSuccess || this.isFailure) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.isSuccess = false;
          this.isFailure = false;
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';
@import '../../styles/_extensions';

.feedback {
  .loading-bouncer {
    visibility: hidden;
  }

  &::before {
    content: '';
    position: absolute;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    @extend %center-contents;
  }
  &--state_loading::before {
    background-color: $white;
    visibility: visible;
  }
  &--state_success {
    background-color: $app--success-background-colour !important;
    color: $app--success-colour !important;
    &::before {
      background-color: inherit;
      color: inherit;
      content: '\2713';
    }
  }
  &--state_failure {
    background-color: $app--failure-background-colour !important;
    color: $app--failure-colour !important;
    &::before {
      background-color: inherit;
      color: inherit;
      content: '\2573';
    }
  }
}
</style>
<style lang="scss">
.loading-bouncer__circle.feedback__bouncer {
  width: 0.75em;
  height: 0.75em;
  margin: 1em 0.2em;
}
</style>
