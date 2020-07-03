<template>
  <div class="help" v-htr-outside-click="onClose">
    <Button
      v-bind="btnProps"
      :icon="helpIcon"
      class="help__button"
      aria-label="Help"
      title="Help"
      @click="onClick"
    ></Button>
    <transition name="fade">
      <div v-if="showHelp" class="help__content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import classNames from 'classnames';

import { Button } from '@/components/Buttons';
import Strings from '@/constants/strings';
import { OutsideClick } from '@/directives/OutsideClick';

export default {
  name: 'Help',
  components: {
    Button
  },
  directives: {
    OutsideClick
  },
  props: { id: { type: String, required: true } },
  data: function () {
    const btnProps = { id: this.id };
    return { helpIcon: '\uFF1F\ufe0e', showHelp: false, btnProps };
  },
  methods: {
    onClick: function () {
      this.showHelp = !this.showHelp;
    },
    onClose: function () {
      this.showHelp = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.help {
  $size: 1.75rem;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;

  &__button {
    min-width: 0px;
    border-radius: 100%;
    padding: 2px;
    margin: 2px;
    width: $size;
    height: $size;

    &::before {
      width: 1rem;
    }
  }

  &__content {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    flex: 1 0;
    min-width: 200px;
    width: max-content;
    max-width: 900px;
    padding: 5px;
    white-space: pre-line;
    z-index: 25;
  }
}
</style>
