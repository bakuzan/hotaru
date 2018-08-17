<template>
  <div id="app">
    <Header />
    <Sidebar/>
    <main>
      <div class="padded">
        <router-view />
      </div>
    </main>
    <portal-target :name="portalName">
    </portal-target>
  </div>
</template>

<script>
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import Strings from '@/constants/strings';

export default {
  name: 'App',
  components: {
    Header,
    Sidebar
  },
  data: function() {
    return {
      portalName: Strings.portal.modal
    };
  }
};
</script>


<style lang="scss">
@import './styles/_variables.scss';
@import './styles/_extensions.scss';
@import './styles/_ripple.scss';
@import './styles/_float-label.scss';

html,
body {
  font-size: $app--font-size;
  width: 100vw;
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
}

main {
  padding: {
    top: $header--height;
    left: $sidebar--width;
  }
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
  padding: $app--standard-padding * 2;
}
</style>
<style lang="scss" src="./styles/_themes.scss" />
