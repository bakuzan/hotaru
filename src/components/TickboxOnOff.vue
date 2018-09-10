<template>
  <div :id="id" :class="classes">
    <Button
      v-bind="onProps"
      @click="toggleTo(true)"
      @mouseover.native="updateHovered"
      @mouseleave.native="updateHovered"
    >
    {{text.on}}
    </Button>
    <Button
      v-bind="offProps"
      @click="toggleTo(false)"
      @mouseover.native="updateHovered"
      @mouseleave.native="updateHovered"
    >
    {{text.off}}
    </Button>
  </div>
</template>

<script>
import classNames from 'classnames';

import { Button } from '@/components/Buttons';

export default {
  name: 'TickboxOnOff',
  components: {
    Button
  },
  props: {
    id: String,
    name: {
      type: String,
      required: true
    },
    text: {
      type: Object,
      default: () => ({
        on: 'On',
        off: 'Off'
      }),
      validator: function(value) {
        const keys = Object.keys(value);
        return ['on', 'off'].every((x) => keys.includes(x));
      }
    },
    checked: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    alignLeft: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return { hoveredId: null };
  },
  computed: {
    classes: function() {
      return classNames('tickbox-on-off', {
        'tickbox-on-off--align-left': this.alignLeft
      });
    },
    onProps: function() {
      return this.sharedProps({ idSuffix: 'on', isActive: this.checked });
    },
    offProps: function() {
      return this.sharedProps({ idSuffix: 'off', isActive: !this.checked });
    }
  },
  methods: {
    sharedProps: function({ idSuffix, isActive }) {
      const id = this.id ? `${this.id}-${idSuffix}` : idSuffix;
      return {
        id,
        class: classNames('tickbox-on-off__button'),
        theme: isActive || this.hoveredId === id ? 'primary' : 'secondary',
        disabled: this.disabled
      };
    },
    updateHovered: function(event) {
      const { target, type } = event;
      this.hoveredId = type === 'mouseover' ? target.id : null;
    },
    toggleTo: function(value) {
      if (value === this.checked) return;
      this.$emit('change', value, this.name);
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';
@import '../styles/_extensions';

.tickbox-on-off {
  @extend %center-contents;
  padding: 5px;
  box-sizing: content-box;

  &--align-left {
    justify-content: flex-start;
  }

  &__button {
    margin: $app--margin-small;
  }
}
</style>
