<template>
    <div :class="classes">
        <figure class="character-card__figure">
            <HTRImage :src="displayImage" class="character-card__image" />
            <figcaption class="character-card__caption">
                <NavLink :to="characterUrl">
                {{name}}
                </NavLink>
            </figcaption>
        </figure>
    </div>
</template>

<script>
import classNames from 'classnames';

import HTRImage from '@/components/HTRImage';
import NavLink from '@/components/NavLink';
import Urls from '@/constants/urls';

export default {
  name: 'CharacterCard',
  components: {
    HTRImage,
    NavLink
  },
  props: {
    id: Number,
    name: String,
    displayImage: String
  },
  computed: {
    classes: function() {
      return classNames('character-card');
    },
    characterUrl: function() {
      return Urls.build(Urls.characterView, { id: this.id });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

.character-card {
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
