<template>
  <ListFigureCard
    v-bind="$props"
    :name="name"
    :display-image="url"
    hide-caption
  />
</template>

<script>
import ListFigureCard from './ListFigureCard';

export default {
  name: 'ImageCard',
  components: {
    ListFigureCard
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    figureSize: {
      type: String,
      default: null,
      validator: function (value) {
        return value === null || ['small'].includes(value);
      }
    },
    remove: {
      type: Function,
      default: null
    }
  }
};
</script>
