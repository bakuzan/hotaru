<template>
  <div class="link-card">
    <div class="link-card__icons">
      <SeedIcon :visible="isSeeded" />
      <TrophyIcon :visible="hasWinner" />
    </div>
    <NavLink :to="itemUrl" :target="linkTarget">{{ name }}</NavLink>
    <div>{{ description }}</div>
    <div v-if="createdAt" class="link-card__date">{{ createdAt }}</div>
  </div>
</template>

<script>
import NavLink from '@/components/NavLink';
import SeedIcon from '@/components/Icons/SeedIcon';
import TrophyIcon from '@/components/Icons/TrophyIcon';

import Urls from '@/constants/urls';

export default {
  name: 'LinkCard',
  components: {
    NavLink,
    SeedIcon,
    TrophyIcon
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    createdAt: {
      type: String,
      default: ''
    },
    htrTemplate: {
      type: Object,
      default: null
    },
    settings: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    urlSource: {
      type: String,
      required: true
    },
    openNewTab: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    itemUrl: function() {
      const resolveType = this.htrTemplate
        ? { type: this.htrTemplate.type }
        : {};

      return Urls.build(this.urlSource, {
        id: this.id,
        ...resolveType
      });
    },
    linkTarget: function() {
      return this.openNewTab ? '_blank' : '';
    },
    hasWinner: function() {
      return !!(this.settings && this.settings.winnerId);
    },
    isSeeded: function() {
      const rules = this.rules || (this.settings && this.settings.rules);
      return rules && rules.isSeeded;
    }
  }
};
</script>

<style lang="scss">
@import '../../styles/_variables';

.link-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 5px 0;
  margin-right: $app--margin-standard;

  &__icons {
    display: flex;
    justify-content: flex-end;
  }

  &__date {
    margin-top: $app--margin-standard;
  }

  // don't do styling like this!!
  .nav-link {
    display: inline-block;
    width: auto;
    height: auto;
    margin-right: auto;
    padding-left: 0;
    border-left: 0;
    margin-left: 0;
  }
}
</style>
