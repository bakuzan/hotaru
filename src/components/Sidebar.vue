<template>
    <nav class="sidebar themed-background">
      <!-- toggle button? -->
      <NavLink :to="base" :class="sideNavLinkClass" title="Home">
        H
      </NavLink>
      <NavLink :to="characterList" :class="sideNavLinkClass" title="Characters">
        C
      </NavLink>
    </nav>
</template>

<script>
import NavLink from '@/components/NavLink';

import Urls from '@/constants/urls';

export default {
  name: 'Sidebar',
  components: {
    NavLink
  },
  computed: {
    sideNavLinkClass: function() {
      return 'sidebar__link';
    },
    base: function() {
      return Urls.base;
    },
    characterList: function() {
      return Urls.characterList;
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
