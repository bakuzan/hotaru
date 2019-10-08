<template>
  <component :is="element" :ref="containerRef">
    <input
      v-if="isActive"
      type="text"
      class="tab-trap tab-trap--top"
      @focus="focusCycler"
    />
    <slot></slot>
    <input
      v-if="isActive"
      type="text"
      class="tab-trap tab-trap--bottom"
      @focus="focusCycler"
    />
  </component>
</template>

<script>
import { generateUniqueId } from '@/utils';

export default {
  name: 'TabTrap',
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
    element: {
      type: String,
      default: 'div'
    },
    firstId: {
      type: String,
      required: true
    },
    lastId: {
      type: String,
      required: true
    }
  },
  data: function() {
    const containerRef = generateUniqueId();

    return {
      containerRef
    };
  },
  watch: {
    isActive: function(currActive, prevActive) {
      const nowActive = !prevActive && currActive;
      const wasActive = !currActive && prevActive;

      if (nowActive) {
        requestAnimationFrame(() => {
          const ref = this.$refs[this.containerRef];
          const target = ref.querySelector(`#${this.firstId}`);

          if (target) {
            target.focus();
          }
        });
      } else if (wasActive) {
        this.$emit('deactivate');
      }
    }
  },
  methods: {
    focusCycler: function(e) {
      const prev = e.relatedTarget;
      const isPrevATrap = prev && prev.className.includes('tab-trap');
      const isCurrTopTrap = e.target.className.includes('tab-trap--top');
      const ref = this.$refs[this.containerRef];

      if (isPrevATrap) {
        const targetId = isCurrTopTrap ? this.firstId : this.lastId;
        const targetElement = ref.querySelector(`#${targetId}`);
        targetElement.focus();
        return;
      }

      const nextTrapClass = isCurrTopTrap
        ? '.tab-trap--bottom'
        : '.tab-trap--top';

      const nextTrap = ref.querySelector(nextTrapClass);
      if (nextTrap === document.activeElement) {
        const targetElement = ref.querySelector(`#${this.firstId}`);
        targetElement.focus();
        return;
      }

      nextTrap.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-trap {
  position: absolute;
  height: 0;
  width: 0;
  padding: 0;
  border: none;
  margin: 0;
  opacity: 0;
}
</style>
