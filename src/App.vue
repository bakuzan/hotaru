<template>
  <div id="app">
    <Header />
    <Sidebar/>
    <main>
      <div class="padded">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default {
  name: 'App',
  components: {
    Header,
    Sidebar
  },
  data: function() {
    return {
      theme: 'theme--one'
    };
  },
  created() {
    document.body.classList.add(this.theme);
  }
};
</script>


<style lang="scss">
@import './styles/_variables.scss';

html,
body {
  width: 100vw;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

body {
  font-family: 'Courier New', Courier, monospace;
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
.padded {
  padding: $app--standard-padding;
}
</style>
