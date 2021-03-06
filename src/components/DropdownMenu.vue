<template>
  <div :id="id" v-htr-outside-click="closeDropdown" class="dropdown">
    <Button
      :id="togglerId"
      :icon="icon"
      :title="title"
      name="dropdownToggle"
      class="dropdown__toggler ripple"
      @click="toggleDropdown"
    />
    <template v-if="isDropdownOpen">
      <ul
        :id="menuId"
        :class="dropdownMenuClasses"
        :style="menuStyle"
        role="menu"
      >
        <li class="dropdown__arrow" />
        <slot></slot>
      </ul>
    </template>
  </div>
</template>

<script>
import classNames from 'classnames';

import { Button } from '@/components/Buttons';

import { OutsideClick } from '@/directives/OutsideClick';
import Strings from '@/constants/strings';
import { getElementCoordinates } from '@/utils';

export default {
  name: 'DropdownMenu',
  components: {
    Button
  },
  directives: {
    OutsideClick
  },
  props: {
    id: { type: String, default: undefined },
    className: { type: String, default: undefined },
    icon: { type: String, default: undefined },
    align: {
      type: String,
      default: Strings.center,
      validator: function (value) {
        return [Strings.left, Strings.right, Strings.center].includes(value);
      }
    },
    portalTarget: { type: String, default: undefined },
    title: { type: String, default: undefined },
    ignorePosition: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      removeOutsideClick: null,
      position: {},
      isDropdownOpen: false
    };
  },
  computed: {
    togglerId: function () {
      return `${this.id}__toggler`;
    },
    menuId: function () {
      return `${this.id}__menu`;
    },
    menuStyle: function () {
      if (this.ignorePosition) return {};

      const { top, left, right } = this.position;
      if (this.align === Strings.left) {
        return { top: `${top}px`, left: `${left}px` };
      } else if (this.align === Strings.right) {
        return { top: `${top}px`, right: `${right}px` };
      } else {
        return { top: `${top}px` };
      }
    },
    dropdownMenuClasses: function () {
      return classNames(
        'dropdown__menu',
        `dropdown__menu--align_${this.align}`,
        this.className
      );
    }
  },
  methods: {
    toggleDropdown: function (event) {
      const position = getElementCoordinates(event.target);

      this.position = position;
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown: function () {
      if (this.isDropdownOpen) {
        this.isDropdownOpen = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_extensions';
@import '../styles/_variables';

.dropdown {
  > input {
    display: none;
  }
  > label {
    cursor: pointer;
    &:before {
      content: attr(icon);
      font-size: 1.5rem;
    }
  }
}

.dropdown__arrow {
  position: absolute;
  top: -20px;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid $white;
  width: 0;
  height: 0;
  filter: drop-shadow(0 -2px 2px #aaa);
}

.dropdown__menu {
  position: fixed;
  width: 200px;
  min-height: 100px;
  background-color: inherit;
  color: inherit;
  border-radius: 4px;
  top: 0;
  right: 0;
  padding: 2px;
  margin: 0;
  list-style-type: none;
  transform: translateY(50%);
  transition: visibility 0.5s;
  transition-delay: 1s !important;
  z-index: map-get($z-index, popover);
  @extend %standard-shadow;

  &--align_left .dropdown-arrow {
    left: 0;
  }
  &--align_center {
    left: 50%;
    transform: translateY(50%) translateX(-50%);
    .dropdown__arrow {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &--align_right .dropdown__arrow {
    right: 0;
  }
}

.dropdown__toggler {
  min-width: 25px;
}
</style>
