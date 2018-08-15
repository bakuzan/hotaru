<template>
    <div :id="id" class="dropdown">
        <Button
            :id="togglerId"
            className="dropdown__toggler ripple"
            :icon="icon"
            :title="title"
            @click="toggleDropdown"
        />
        <template v-if="isDropdownOpen">
            <portal :to="portalTarget">
                <ul
                    :id="menuId"
                    :class="dropdownMenuClasses"
                    :style="menuStyle"
                    role="menu"
                >
                    <li class="dropdown__arrow" />
                    <slot></slot>
                </ul>
                <Backdrop 
                    :id="backdropId" 
                    @close="toggleDropdown" 
                />
            </portal>
        </template>
    </div>
</template>

<script>
import classNames from 'classnames';

import Backdrop from '@/components/Backdrop';
import Button from '@/components/Button';

import Strings from '@/constants/strings';
import { getElementCoordinates } from '@/utils';

export default {
  name: 'DropdownMenu',
  components: {
    Backdrop,
    Button
  },
  props: {
    id: String,
    icon: String,
    align: {
      type: String,
      default: Strings.center,
      validator: function(value) {
        return [Strings.left, Strings.right, Strings.center].includes(value);
      }
    },
    portalTarget: String,
    title: String
  },
  data: function() {
    return {
      position: {},
      isDropdownOpen: false
    };
  },
  computed: {
    togglerId: function() {
      return `${this.id}__toggler`;
    },
    menuId: function() {
      return `${this.id}__menu`;
    },
    backdropId: function() {
      return `${this.id}__backdrop`;
    },
    menuStyle: function() {
      const { top, left, right } = this.position;
      return this.align === Strings.left
        ? { top: `${top}px`, left: `${left}px` }
        : this.align === Strings.right
          ? { top: `${top}px`, right: `${right}px` }
          : { top: `${top}px` };
    },
    dropdownMenuClasses: function() {
      return classNames(
        'dropdown__menu',
        `dropdown__menu--align_${this.align}`
      );
    }
  },
  methods: {
    toggleDropdown: function(event) {
      const position = getElementCoordinates(event.target);
      this.position = position;
      this.isDropdownOpen = !this.isDropdownOpen;
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
