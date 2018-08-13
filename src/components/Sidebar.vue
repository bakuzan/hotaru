<template>
    <nav class="sidebar">
      <!-- toggle button? -->
      <NavLink to="/">
        H
      </NavLink>
      <NavLink to="/characters">
        C
      </NavLink>
    </nav>
</template>

<script>
import NavLink from '@/components/NavLink';

export default {
  name: 'Sidebar',
  components: {
    NavLink
  },
  props: {}
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.sidebar {
  position: fixed;
  top: $header--height;
  display: flex;
  flex-direction: column;
  width: $sidebar--width;
  height: calc(100vh - #{$header--height});
}
</style>
