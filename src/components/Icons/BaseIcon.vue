<template>
  <div class="htr-icon">
    <div
      v-if="visible"
      :icon="icon"
      :title="title"
      class="htr-icon__display"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'BaseIcon',
  props: {
    icon: {
      type: String,
      default: undefined
    },
    title: {
      type: String,
      default: undefined
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
  width: 1.25em;
  height: 1.25em;
  z-index: map-get($z-index, above-siblings);

  &__display::before {
    content: attr(icon);
  }
}
</style>
