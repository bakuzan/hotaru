<template>
  <div class="link-card">
    <SeedIcon v-if="isSeeded" right/>
    <div v-if="hasWinner" class="trohpy-icon" :icon="trophyIcon" title="Has Winner"></div>
    <NavLink :to="itemUrl" :target="linkTarget">{{name}}</NavLink>
    <div>{{description}}</div>
    <div v-if="createdAt" class="link-card__date">{{createdAt}}</div>
  </div>
</template>

<script>
import NavLink from '@/components/NavLink';
import SeedIcon from '@/components/SeedIcon';

import Urls from '@/constants/urls';
import Icons from '@/constants/icons';

export default {
  name: 'LinkCard',
  components: {
    NavLink,
    SeedIcon
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
      type: String
    },
    createdAt: {
      type: String
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
  data: function() {
    return { trophyIcon: Icons.trophy };
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

  &__date {
    margin-top: $app--margin-standard;
  }

  // don't do styling like this!!
  .nav-link {
    display: inline-block;
    width: auto;
    margin-right: auto;
    padding-left: 0;
    border-left: 0;
    margin-left: 0;
  }
}

.trohpy-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 1em;
  height: 1em;

  &::before {
    content: attr(icon);
  }
}
</style>
