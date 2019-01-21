<template>
  <div class="htr-icon">
    <div v-if="visible" class="htr-icon__display" :title="title" :icon="icon"></div>
  </div>
</template>

<script>
export default {
  name: 'BaseIcon',
  props: {
    icon: {
      type: String
    },
    title: {
      type: String
    },
    visible: {
      type: Boolean,
      default: true
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.htr-icon {
  @extend %center-contents;
  width: 1.1em;
  height: 1.1em;
  z-index: map-get($z-index, above-siblings);

  &__display::before {
    content: attr(icon);
  }
}
</style>
