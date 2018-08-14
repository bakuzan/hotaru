<template>
    <div :class="headerClass">
      <div>
        <Logo :id="logoId" />
      </div>
      <div>
        <!-- universal search placeholder (?) -->
      </div>
      <div class="flex-spacer"></div>
      <div>
        <!-- settings button placeholder -->
      </div>
    </div>
</template>

<script>
import classNames from 'classnames';

import Logo from '@/components/Logo';
import appPrefix from '@/constants/selectors';
import { createListeners, getWindowScrollPosition } from '@/utils';

export default {
  name: 'Header',
  components: {
    Logo
  },
  data: function() {
    return {
      logoId: `${appPrefix}-logo`,
      scrollListeners: null,
      windowScrollPosition: 0
    };
  },
  computed: {
    headerClass: function() {
      return classNames('header', {
        'header--page-scrolled': !!this.windowScrollPosition
      });
    }
  },
  mounted() {
    this.scrollListeners = createListeners('scroll', () => {
      const windowScrollPosition = getWindowScrollPosition();
      if (windowScrollPosition !== this.windowScrollPosition) {
        this.windowScrollPosition = windowScrollPosition;
      }
    })();
    this.scrollListeners.listen();
  },
  beforeDestroy() {
    this.scrollListeners.remove();
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.header {
  display: flex;
  position: fixed;
  width: 100%;
  height: $header--height;

  &--page-scrolled {
    box-shadow: 0px 2px 5px 1px #000;
  }
}
</style>
