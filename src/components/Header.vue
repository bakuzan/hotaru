<template>
    <div class="header">
      <div>
        <!-- logo placeholder -->
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
