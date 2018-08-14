<template>
    <div class="header">
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
import Logo from '@/components/Logo';
import appPrefix from '@/constants/selectors';

export default {
  name: 'Header',
  components: {
    Logo
  },
  data: function() {
    return {
      logoId: `${appPrefix}-logo`
    };
  }
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
