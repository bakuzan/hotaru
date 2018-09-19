<template>
    <Tickbox 
    v-bind="$props"
        customTickbox="tickbox--heart" 
        @change="onChange" 
    />
</template>

<script>
import Tickbox from '@/components/Tickbox';

export default {
  name: 'TickboxHeart',
  components: {
    Tickbox
  },
  props: {
    id: {
      type: [String, Number]
    },
    name: {
      type: String,
      required: true
    },
    text: {
      type: String
    },
    checked: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    onChange: function(...values) {
      this.$emit('change', ...values);
    }
  }
};
</script>


<style lang="scss">
@import '../styles/_variables';

.tickbox--heart .tickbox__input {
  &:before {
    content: '\2661';
    font-size: 2em;
  }
  &:checked:before {
    content: '\2665';
    color: #f0f;
  }
}
</style>
