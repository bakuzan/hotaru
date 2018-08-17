<template>
    <div class="view-block">
        <label class="view-block__label">{{ value ? label : noDataText }}</label>
        <Button
            className="view-block__button"
            @click="$emit('toggle')"
        >
            {{value}}
        </Button>
    </div>
</template>

<script>
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
      type: [String, Number],
      default: null
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables';
@import '../styles/_extensions';

.view-block {
  padding: $app--standard-padding 0;

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
</style>
