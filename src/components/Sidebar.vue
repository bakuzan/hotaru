<template>
    <nav class="sidebar"><!-- sidebar here --></nav>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {}
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.sidebar {
  position: fixed;
  width: $sidebar--width;
  height: 100vh;
}
</style>
