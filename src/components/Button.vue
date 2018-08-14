<template>
    <button
        :class="buttonClasses"
        :type="buttonType"
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
    type: String,
    icon: String,
    theme: ['primary', 'secondary']
  },
  computed: {
    buttonClasses: function() {
      const theme = this.theme || 'default';
      return classNames(
        'button',
        `button--theme_${theme}`,
        {
          'button--icon': !!this.icon
        },
        this.className
      );
    },
    buttonType: function() {
      return this.type || 'button';
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
@import '../styles/_variables';
</style>
