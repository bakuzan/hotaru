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
  name: 'FigureCard',
  components: {
    ListFigureCard
  },
  props: {
    id: Number,
    url: String,
    remove: {
      type: Function,
      default: null
    }
  }
};
</script>
