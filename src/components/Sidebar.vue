<template>
  <nav class="sidebar themed-background">
    <!-- toggle button? -->
    <NavLink
      v-for="link in links"
      :key="link.id"
      :to="link.to"
      :class="sideNavLinkClass"
      :title="link.title"
      >{{ link.text }}</NavLink
    >
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
  data: function () {
    return {
      links: [
        { id: 1, to: '/', title: 'Home', text: 'H' },
        { id: 2, to: Urls.characterList, title: 'Characters', text: 'C' },
        { id: 3, to: Urls.seriesList, title: 'Series', text: 'S' },
        {
          id: 4,
          to: Urls.versusComparison,
          title: 'Versus Comparison',
          text: 'VC'
        },
        { id: 5, to: Urls.gauntlet, title: 'Gauntlet', text: 'G' },
        {
          id: 6,
          to: Urls.htrTemplateList,
          title: 'Templates',
          text: 'T'
        },
        {
          id: 7,
          to: Urls.htrInstanceList,
          title: 'Lists and Brackets',
          text: 'LB'
        },
        {
          id: 8,
          to: Urls.htrInstanceLeagueCenter,
          title: 'League Center',
          text: 'LC'
        },
        {
          id: 9,
          to: Urls.rankingList,
          title: 'Rankings',
          text: 'R'
        }
      ]
    };
  },
  computed: {
    sideNavLinkClass: function () {
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

  &__link {
    display: flex;
  }
}
</style>
