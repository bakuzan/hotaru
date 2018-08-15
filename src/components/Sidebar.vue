<template>
    <nav class="sidebar themed-background">
      <!-- toggle button? -->
      <NavLink to="/" :class="sideNavLinkClass" title="Home">
        H
      </NavLink>
      <NavLink to="/characters" :class="sideNavLinkClass" title="Characters">
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
  computed: {
    sideNavLinkClass: function() {
      return 'sidebar__link';
    }
  }
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
