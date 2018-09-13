<template>
  <div class="link-card">
    <NavLink 
        :to="itemUrl"
        :target="linkTarget"
    >
    {{name}}
    </NavLink>
    <div>{{description}}</div>
  </div>
</template>

<script>
import NavLink from '@/components/NavLink';

import Urls from '@/constants/urls';

export default {
  name: 'LinkCard',
  components: {
    NavLink
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
      return Urls.build(this.urlSource, { id: this.id });
    },
    linkTarget: function() {
      return this.openNewTab ? '_blank' : '';
    }
  }
};
</script>
