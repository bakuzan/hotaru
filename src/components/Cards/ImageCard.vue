<template>
  <ListFigureCard v-bind="$props" :name="alt" :display-image="url" hide-caption/>
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
    url: {
      type: String
    },
    figureSize: {
      type: String,
      default: null,
      validator: function(value) {
        return value === null || ['small'].includes(value);
      }
    },
    remove: {
      type: Function,
      default: null
    }
  },
  computed: {
    alt: function() {
      return (this.character && this.character.name) || 'Unknown Image';
    }
  }
};
</script>
