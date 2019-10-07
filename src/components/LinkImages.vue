<template>
  <div class="link-images">
    <img :src="darkLink" class="link-images__dark" alt="link" />
    <img :src="lightLink" class="link-images__light" alt="link" />
  </div>
</template>

<script>
import BlackLinkSVG from '@/assets/link_black.svg';
import WhiteLinkSVG from '@/assets/link_white.svg';

export default {
  name: 'LinkImages',
  props: {
    to: { type: String, default: '' }
  },
  data: function() {
    return {
      darkLink: BlackLinkSVG,
      lightLink: WhiteLinkSVG
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';

$size: 24px;

.link-images {
  width: $size;
  height: $size;

  &__dark,
  &__light {
    display: none;
    width: $size;
    height: $size;
  }
}
</style>
