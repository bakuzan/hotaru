<template>
  <div :class="classes" title="Is Seeded"></div>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'SeedIcon',
  props: {
    right: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes: function() {
      return classNames('seed-icon', {
        'seed-icon--align_top-left': !this.right,
        'seed-icon--align_top-right': this.right
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.seed-icon {
  position: absolute;
  top: 0;
  width: 1em;
  height: 1em;
  &::before {
    content: '\D83C\DF42';
  }

  &--align_top-left {
    left: 0;
  }
  &--align_top-right {
    right: 1em;
  }
}
</style>
