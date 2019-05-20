<template>
  <div :class="classes">
    <Button
      v-if="remove"
      :icon="removeIcon"
      class="list-figure-card__remove"
      size="small"
      theme="secondary"
      @click="handleRemove"
    />
    <figure :class="figureClasses">
      <div v-if="isWaifu" class="heart" title="Waifu"></div>
      <div class="list-figure-card__image-wrapper">
        <HTRImage :src="displayImage" :class="imageClasses" :alt="name" />
      </div>
      <figcaption v-if="!hideCaption" class="list-figure-card__caption">
        <NavLink
          v-if="itemUrl && name"
          :to="itemUrl"
          :target="linkTarget"
          :title="name"
          class="list-figure-card__link"
          >{{ name }}</NavLink
        >
        <div v-if="!itemUrl">{{ name }}</div>
      </figcaption>
    </figure>
  </div>
</template>

<script>
import classNames from 'classnames';

import HTRImage from '@/components/HTRImage';
import NavLink from '@/components/NavLink';
import { Button } from '@/components/Buttons';

import Icons from '@/constants/icons';
import Urls from '@/constants/urls';

export default {
  name: 'ListFigureCard',
  components: {
    HTRImage,
    NavLink,
    Button
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: { type: String, default: '' },
    displayImage: { type: String, default: '' },
    isWaifu: {
      type: Boolean,
      default: false
    },
    urlSource: {
      type: String,
      default: null
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
    },
    figureSize: {
      type: String,
      default: null,
      validator: function(value) {
        return value === null || ['small'].includes(value);
      }
    },
    figureDirection: {
      type: String,
      default: 'column',
      validator: function(value) {
        return ['column', 'row'].includes(value);
      }
    },
    figureClass: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return { removeIcon: Icons.cross };
  },
  computed: {
    classes: function() {
      return classNames('list-figure-card', {
        [`list-figure-card--${this.figureSize}`]: this.figureSize
      });
    },
    figureClasses: function() {
      return classNames('list-figure-card__figure', this.figureClass, {
        [`list-figure-card__figure--size_${this.figureSize}`]: this.figureSize,
        [`list-figure-card__figure--direction_${this.figureDirection}`]: this
          .figureDirection
      });
    },
    imageClasses: function() {
      const isPlaceholder =
        this.displayImage === Urls.images.characterPlaceholder;
      return classNames('list-figure-card__image', {
        'list-figure-card__image--placeholder': isPlaceholder
      });
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

$image-width: 96px;
$image-width--small: 50px;
$preferred-image-height: $image-width / 0.64;
$preferred-image-height--small: $image-width--small / 0.64;

.list-figure-card {
  position: relative;
  height: 100%;
  @extend %standard-border;

  &--small {
    height: auto;
  }

  &__remove {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 1px;
    margin: 1px;
    background: transparent; // Having background can cause overlap.
  }

  &__figure {
    display: flex;
    flex-direction: column;
    height: calc(100% - #{$app--margin-standard * 2});
    margin: $app--margin-standard;
  }

  &__caption {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: $app--padding-standard 0;
    text-align: center;
  }

  &__link {
    display: inline-block;
    height: auto;
    width: auto;
    vertical-align: text-top;
    /* overflow: hidden;
    text-overflow: ellipsis; */
  }

  &__image-wrapper {
    display: flex;
    width: 100%;
    min-height: $preferred-image-height;
    max-height: $preferred-image-height;
    overflow: hidden;
  }
  &__image {
    width: $image-width;
    /* height: 150px; try without this so images can maintain their aspect ratios */
  }
}

.list-figure-card:hover {
  .list-figure-card__remove {
    display: block;
  }
}

.list-figure-card__figure {
  &--direction_row {
    flex-direction: row;
    & .list-figure-card__image-wrapper {
      width: auto;
      min-width: min-content;
    }
  }

  &--size_small {
    & .list-figure-card__image-wrapper {
      min-height: $preferred-image-height--small;
      max-height: $preferred-image-height--small;
    }
    & .list-figure-card__image {
      width: $image-width--small;
      /* height: 75px; try without this so images can maintain their aspect ratios */
    }
  }
}

.heart {
  position: absolute;
  top: 0;
  left: 0;

  &::before {
    content: '\2665';
    font-size: 1.5em;
    color: #f0f;
  }
}
</style>
