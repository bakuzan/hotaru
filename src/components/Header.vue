<template>
  <div :class="headerClass">
    <div :class="headerInnerClass">
      <Logo :id="logoId" />
    </div>
    <div :class="headerInnerClass">
      <InputBoxNavi />
    </div>
    <div :class="headerInnerClass">
      <portal-target :name="backPortalName"> </portal-target>
    </div>
    <div class="flex-spacer"></div>
    <h1 :class="titleClass">Hotaru</h1>
    <div class="flex-spacer"></div>
    <div :class="headerInnerClass">
      <portal-target :name="portalName"> </portal-target>
    </div>
    <div :class="headerInnerClass">
      <AppSettings />
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';

import Logo from '@/components/Logo';
import AppSettings from '@/components/AppSettings';
import InputBoxNavi from '@/components/InputBoxNavi';
import Strings from '@/constants/strings';
import appPrefix from '@/constants/selectors';
import { createListeners, getWindowScrollPosition } from '@/utils';

export default {
  name: 'Header',
  components: {
    Logo,
    AppSettings,
    InputBoxNavi
  },
  data: function () {
    return {
      logoId: `${appPrefix}-logo`,
      scrollListeners: null,
      windowScrollPosition: 0,
      backPortalName: Strings.portal.backButton
    };
  },
  computed: {
    headerClass: function () {
      return classNames('header', 'themed-background', {
        'header--page-scrolled': !!this.windowScrollPosition
      });
    },
    headerInnerClass: function () {
      return 'header__inner';
    },
    titleClass: function () {
      return classNames(this.headerInnerClass, 'header__title');
    },
    portalName: function () {
      return Strings.portal.actions;
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
  z-index: map-get($z-index, header);

  &--page-scrolled {
    box-shadow: 0px 2px 5px 1px #000;
  }

  &__inner {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: 1.625em;
  }
}
</style>
