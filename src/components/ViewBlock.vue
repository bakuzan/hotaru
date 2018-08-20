<template>
    <div :class="classes">
      <label 
        class="view-block__label"
      >
      {{ label }}
      </label>
      <Button
          className="view-block__button"
          @click="$emit('toggle')"
      >
        <slot>
          <!-- placeholder -->
          {{value || noDataText}}
        </slot>
      </Button>
    </div>
</template>

<script>
import classNames from 'classnames';

import Button from '@/components/Button';

export default {
  name: 'ViewBlock',
  components: {
    Button
  },
  props: {
    noDataText: String,
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Array],
      default: null
    }
  },
  computed: {
    classes: function() {
      return classNames('view-block', { 'view-block--no-data': !this.value });
    }
  },
  methods: {
    onNoData: function() {
      if (this.value) return;
      this.$emit('toggle');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables';
@import '../styles/_extensions';

.view-block {
  padding: $app--padding-standard 0;

  &__label {
    font-weight: bold;
  }

  &__button {
    @extend %standard-border;
    min-width: 0;
    text-align: left;

    &:hover {
      border-color: darken($white, 33%);
    }
  }
}
// .view-block--no-data {
//   .view-block__label {
//     @extend %standard-border;
//     padding: $app--padding-standard;
//     cursor: pointer;

//     &:hover {
//       border-color: darken($white, 33%);
//     }
//   }
// }
</style>
