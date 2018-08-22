<template>
    <div :class="classes">
        <figure class="list-figure-card__figure">
            <HTRImage :src="displayImage" class="list-figure-card__image" />
            <figcaption class="list-figure-card__caption">
                <NavLink 
                  v-if="itemUrl"
                  :to="itemUrl"
                >
                {{name}}
                </NavLink>
                <div
                  v-if="!itemUrl"
                >
                  {{name}}
                </div>
            </figcaption>
        </figure>
    </div>
</template>

<script>
import classNames from 'classnames';

import HTRImage from '@/components/HTRImage';
import NavLink from '@/components/NavLink';
import Urls from '@/constants/urls';
import { isString } from '@/utils';

export default {
  name: 'ListFigureCard',
  components: {
    HTRImage,
    NavLink
  },
  props: {
    id: Number,
    name: String,
    displayImage: String,
    urlSource: {
      type: String,
      default: null,
      validator: function(value) {
        return (
          value === null ||
          Object.keys(Urls)
            .filter((k) => isString(Urls[k]))
            .includes(value)
        );
      }
    }
  },
  computed: {
    classes: function() {
      return classNames('list-figure-card');
    },
    itemUrl: function() {
      if (!this.urlSource) return null;
      return Urls.build(this.urlSource, { id: this.id });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.list-figure-card {
  @extend %standard-border;

  &__figure {
    display: flex;
    flex-direction: column;
  }
  &__caption {
    width: 100%;
    padding: $app--padding-standard 0;
    text-align: center;
  }
  &__image {
    width: 100px;
    height: 150px;
  }
}
</style>
