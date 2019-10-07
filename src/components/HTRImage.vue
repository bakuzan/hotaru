<template>
  <img :alt="alt" :class="classes" @error="onError" />
</template>

<script>
import classNames from 'classnames';
import Urls from '@/constants/urls';

export default {
  name: 'HTRImage',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    forceLoad: {
      type: Boolean,
      default: false
    },
    suffix: {
      type: String,
      default: 't'
    }
  },
  data: function() {
    return {
      fallback: Urls.images.deadImage,
      placeholder: Urls.images.characterPlaceholder,
      observer: null
    };
  },
  computed: {
    classes: function() {
      return classNames('image', { 'image--empty': !this.src });
    }
  },
  watch: {
    src: function(nv, ov) {
      if (nv !== ov) {
        const image = this.getImageWithSuffix(nv || this.placeholder);
        this.$el.setAttribute('src', image);
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      if (!this.forceLoad) {
        this.observer = new IntersectionObserver(
          ([entry]) => {
            if (entry && entry.isIntersecting && this.src) {
              this.$el.setAttribute('src', this.getImageWithSuffix(this.src));
              this.observer.disconnect();
            }
          },
          {
            rootMargin: '50px 0px'
          }
        );
        this.observer.observe(this.$el);
      }
    });
  },
  methods: {
    getImageWithSuffix: function(url) {
      if (!url.includes('imgur')) {
        return url;
      }

      const parts = url.split('.');
      const img = parts.slice(0, -1).join('.');
      const ext = parts.slice(-1).pop();
      return `${img}${this.suffix}.${ext}`;
    },
    onError: function(event) {
      event.target.onerror = null;
      event.target.src = this.getImageWithSuffix(this.fallback);
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

  &--empty {
    border: 1px dashed;
  }
}
</style>
