<template>
  <section
    v-show="isActive"
    :id="tabHash"
    :aria-hidden="!isActive"
    :class="panelClasses"
    role="tabpanel"
  >
    <transition name="fade">
      <slot v-if="isActive"></slot>
    </transition>
  </section>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'Tab',
  props: {
    id: { type: String, default: null },
    name: { type: String, required: true },
    isDisabled: { type: Boolean, default: false }
  },
  data: function () {
    return {
      isActive: false,
      isVisible: true,
      isLocked: false
    };
  },
  computed: {
    panelClasses: function () {
      return classNames('tab-panel', { 'tab-panel--active': this.isActive });
    },
    text() {
      return this.name;
    },
    tabHash() {
      if (this.isDisabled || this.isLocked) return '#';

      return this.id
        ? `#${this.id}`
        : `#${this.name.toLowerCase().replace(/ /g, '-')}`;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.tab-panel {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 5px;
  margin: 0;
  opacity: 0;
  transition: all 1s ease-in-out;
  pointer-events: none;

  &--active {
    position: relative;
    opacity: 1;
    z-index: map-get($z-index, above-siblings);
    pointer-events: auto;
  }
}
</style>
