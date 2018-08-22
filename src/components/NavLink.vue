<template>
    <router-link 
        :class="classes"
        active-class="nav-link--active"
        exact-active-class="nav-link--active_exact"
        :to="to"
        rel="noopener noreferrer"
    >
        <slot></slot>
    </router-link>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'NavLink',
  props: {
    to: String
  },
  computed: {
    classes: function() {
      return classNames('nav-link', 'center-contents');
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.nav-link {
  width: 100%;
  height: $nav-link--height;
  padding: $app--padding-standard;
  border: 3px solid transparent;
  box-sizing: border-box;
  font-size: 1.25em;
  text-decoration: none;
}
</style>
