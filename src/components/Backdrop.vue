<template>
      <div
        :id="backdropId"
        class="backdrop"
        role="button"
        tabIndex="0"
        @click="handleClose"
        @keydown.enter="handleClose"
        @keydown.space="handleClose"
        @keydown.esc="handleClose"
      />
</template>

<script>
export default {
  name: 'Backdrop',
  props: {
    id: String
  },
  computed: {
    backdropId: function() {
      return `${this.id}__backdrop`;
    }
  },
  methods: {
    handleClose: function(event) {
      this.$emit('close', event);
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: map-get($z-index, above-siblings);
}
</style>
