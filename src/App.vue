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
      theme: 'theme--one',
      portalName: Strings.portalName
    };
  },
  created() {
    document.body.classList.add(this.theme);
  }
};
</script>


<style lang="scss">
@import './styles/_variables.scss';
@import './styles/_themes.scss';

html,
body {
  width: 100vw;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

body {
  font-family: 'Roboto mono', 'Lucida Console', 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  padding: $app--standard-padding;
}
</style>
