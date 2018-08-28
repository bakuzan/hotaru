<template>
  <ListFigureCard
    v-bind="$props"
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
      type: [String, Number]
    },
    url: String,
    remove: {
      type: Function,
      default: null
    }
  }
};
</script>
