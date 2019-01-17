<template>
  <div :class="classes" :icon="icon"></div>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'BaseIcon',
  props: {
    icon: {
      type: String
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classes: function() {
      return classNames('htr-icon', {
        'htr-icon--visible': this.visible
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../../styles/_extensions.scss';

.htr-icon {
  @extend %center-contents;
  width: 1.1em;
  height: 1.1em;

  &--visible::before {
    content: attr(icon);
  }
}
</style>
