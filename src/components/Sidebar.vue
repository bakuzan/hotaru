<template>
    <nav class="sidebar themed-background">
      <!-- toggle button? -->
      <NavLink 
        v-for="link in links"
        :key="link.id"
        :to="link.to" 
        :class="sideNavLinkClass" 
        :title="link.title"
      >
        {{link.text}}
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
  data: function() {
    return {
      links: [
        { id: 1, to: Urls.base, title: 'Home', text: 'H' },
        { id: 2, to: Urls.characterList, title: 'Characters', text: 'C' },
        { id: 3, to: Urls.seriesList, title: 'Series', text: 'S' },
        {
          id: 4,
          to: Urls.versusComparison,
          title: 'Versus Comparison',
          text: 'VCo'
        },
        { id: 5, to: Urls.versusCreator, title: 'Versus Creator', text: 'VCr' }
      ]
    };
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
  z-index: map-get($z-index, sidebar);
}
</style>
