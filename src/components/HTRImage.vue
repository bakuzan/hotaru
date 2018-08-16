<template>
    <img 
        :class="classes" 
        :src="src" 
        @error="onError"
    />
</template>

<script>
import classNames from 'classnames';

import Strings from '@/constants/strings';

export default {
  name: 'HTRImage',
  props: {
    src: String
  },
  data: function() {
    return {
      fallback: Strings.deadImage
    };
  },
  computed: {
    classes: function() {
      return classNames('image');
    }
  },
  methods: {
    onError: function(event) {
      event.target.onerror = null;
      event.target.src = this.fallback;
      console.log('error', this);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/_extensions.scss';

.image {
  min-height: 100px;
  min-width: 100px;
  width: auto;
  max-width: 100%;
  margin: auto;
}
</style>
