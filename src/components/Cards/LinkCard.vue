<template>
    <div class="link-card">
        <NavLink 
            :to="itemUrl"
            :target="linkTarget"
        >
        {{name}}
        </NavLink>
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
    type: {
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
      return Urls.build(this.urlSource, { id: this.id, type: this.type });
    },
    linkTarget: function() {
      return this.openNewTab ? '_blank' : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.series-card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>
