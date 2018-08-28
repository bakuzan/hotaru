<template>
    <div :class="classes">
        <Button
          v-if="remove"
          className="list-figure-card__remove"
          size="small"
          theme="secondary"
          :icon="removeIcon"
          @click="handleRemove"
        />
        <figure class="list-figure-card__figure">
            <HTRImage :src="displayImage" class="list-figure-card__image" />
            <figcaption v-if="!hideCaption" class="list-figure-card__caption">
                <NavLink 
                  v-if="itemUrl"
                  :to="itemUrl"
                  :target="linkTarget"
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
import Button from '@/components/Button';

import Icons from '@/constants/icons';
import Urls from '@/constants/urls';
import { isString } from '@/utils';

export default {
  name: 'ListFigureCard',
  components: {
    HTRImage,
    NavLink,
    Button
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
            .map((k) => Urls[k])
            .includes(value)
        );
      }
    },
    openNewTab: {
      type: Boolean,
      default: false
    },
    remove: {
      type: Function,
      default: null
    },
    hideCaption: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return { removeIcon: Icons.cross };
  },
  computed: {
    classes: function() {
      return classNames('list-figure-card');
    },
    itemUrl: function() {
      if (!this.urlSource) return null;
      return Urls.build(this.urlSource, { id: this.id });
    },
    linkTarget: function() {
      return this.openNewTab ? '_blank' : '';
    }
  },
  methods: {
    handleRemove: function() {
      this.remove(this.id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.list-figure-card {
  position: relative;
  @extend %standard-border;

  &__remove {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 1px;
    margin: 1px;
  }

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

.list-figure-card:hover {
  .list-figure-card__remove {
    display: block;
  }
}
</style>
