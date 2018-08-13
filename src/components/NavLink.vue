<template>
    <router-link 
        class="nav-link center-contents"
        :to="to"
    >
        <slot></slot>
    </router-link>
</template>

<script>
export default {
  name: 'NavLink',
  props: {
    to: String
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.nav-link {
  width: 100%;
  height: $nav-link--height;
  padding: $app--standard-padding;
  border: 3px solid transparent;
  box-sizing: border-box;
  font-size: 1.25em;
  text-decoration: none;

  &:hover,
  &.router-link-exact-active {
    border-right-color: #000;
  }
}
</style>
