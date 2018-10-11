<template>
  <div id="app" class="app">
    <Header />
    <Sidebar/>
    <main>
      <div class="padded">
        <router-view />
      </div>
    </main>
    <Alert />
    <portal-target :name="portalName">
    </portal-target>
    <portal-target :name="naviPortalName">
    </portal-target>
  </div>
</template>

<script>
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Alert from '@/components/Alert';

import Strings from '@/constants/strings';

export default {
  name: 'App',
  components: {
    Header,
    Sidebar,
    Alert
  },
  data: function() {
    return {
      portalName: Strings.portal.modal,
      naviPortalName: Strings.portal.naviMenu
    };
  }
};
</script>

<style lang="scss">
@import './styles/_variables.scss';
@import './styles/_extensions.scss';
@import './styles/_ripple.scss';
@import './styles/_float-label.scss';
@import './styles/_transitions';

html,
body {
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body,
button {
  @extend %app-font-family;
  font-size: $app--font-size;
}

main {
  min-height: calc(100vh - #{$header--height});
  padding: {
    top: $header--height;
    left: $sidebar--width;
  }
  overflow-x: hidden;
}

// App helpers

.center-contents {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-spacer {
  display: flex;
  flex: 1;
}

.padded {
  padding: $app--padding-standard * 2;
  &--standard {
    padding: $app--padding-standard;
  }
  &--small {
    padding: $app--padding-small;
  }
}

.button-group {
  display: flex;
  &--shrink {
    flex: 0 1;
  }
}
</style>
<style lang="scss" src="./styles/_themes.scss" />
