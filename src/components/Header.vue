<template>
    <div class="header">
      <router-link to="/"/>
      <router-link to="/characters"/>
    </div>
</template>

<script>
export default {
  name: 'Header',
  props: {}
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.header {
  position: fixed;
  width: 100%;
  height: $header--height;
}
</style>
