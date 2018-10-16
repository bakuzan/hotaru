<template>
  <img 
    class="image" 
    @error="onError"
  />
</template>

<script>
import Strings from '@/constants/strings';

export default {
  name: 'HTRImage',
  props: {
    src: {
      type: String
    },
    forceLoad: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      fallback: Strings.deadImage,
      observer: null
    };
  },
  watch: {
    src: function(nv, ov) {
      if (this.forceLoad && nv && nv !== ov) {
        this.$el.setAttribute('src', nv);
      }
    }
  },
  mounted() {
    if (!this.forceLoad) {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry && entry.isIntersecting) {
            console.log(entry, this.src);
            if (this.src) {
              this.$el.setAttribute('src', this.src);
              this.observer.disconnect();
            }
          }
        },
        {
          rootMargin: '50px 0px'
        }
      );

      this.observer.observe(this.$el);
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
  min-height: 50px;
  min-width: 50px;
  width: auto;
  max-width: 100%;
  margin: auto;
}
</style>
