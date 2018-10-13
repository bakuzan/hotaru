<template>
  <div class="link-images">
    <img class="link-images__dark" :src="darkLink" />
    <img class="link-images__light" :src="lightLink" />
  </div>
</template>

<script>
import BlackLinkSVG from '@/assets/link_black.svg';
import WhiteLinkSVG from '@/assets/link_white.svg';

export default {
  name: 'LinkImages',
  props: {
    to: String
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
