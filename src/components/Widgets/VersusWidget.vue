<template>
  <div :id="id" :class="classes">
    <VersusCard
      :class="versusClass"
      :item="versusCharacters[0]"
      :winner-id="winnerId"
      :is-dummy="isDummy"
      :is-final="isFinal"
      :figure-size="figureSize"
      :open-new-tab="openNewTab"
      grow
      @vote="handleVote"
    />
    <div v-if="!enableCompare" class="versus__icon">VS</div>
    <router-link
      v-if="enableCompare"
      :to="compareLink"
      :target="openNewTab ? '_blank' : null"
      class="versus__icon"
      >VS</router-link
    >
    <VersusCard
      :class="versusClass"
      :item="versusCharacters[1]"
      :winner-id="winnerId"
      :is-dummy="isDummy"
      :is-final="isFinal"
      :figure-size="figureSize"
      :open-new-tab="openNewTab"
      grow
      @vote="handleVote"
    />
  </div>
</template>

<script>
import classNames from 'classnames';
import { VersusCard } from '@/components/Cards';

import Urls from '@/constants/urls';

export default {
  name: 'VersusWidget',
  components: {
    VersusCard
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    characters: {
      type: Array,
      default: () => []
    },
    winnerId: {
      type: Number,
      default: null
    },
    enableCompare: {
      type: Boolean,
      default: false
    },
    isDummy: {
      type: Boolean,
      default: false
    },
    isFinal: {
      type: Boolean,
      default: false
    },
    grow: {
      type: Boolean,
      default: false
    },
    figureSize: {
      type: String,
      default: 'small',
      validator: function (value) {
        return value === null || ['small'].includes(value);
      }
    },
    column: {
      type: Boolean,
      default: false
    },
    openNewTab: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    shouldStack: function () {
      return this.column && !this.isFinal;
    },
    classes: function () {
      return classNames('versus', {
        'versus--is-dummy': this.isDummy,
        'versus--grow': this.grow,
        'versus--column': this.shouldStack
      });
    },
    versusClass: function () {
      return classNames('versus__versus-card', {
        'versus__versus-card--stacked': this.shouldStack
      });
    },
    compareLink: function () {
      const ids = this.characters.map((x) => x.id).join(',');
      return `${Urls.versusComparison}?characterIds=${ids}`;
    },
    versusCharacters: function () {
      const [c1, c2] = this.characters;
      return c1.order > c2.order ? [c2, c1] : [c1, c2];
    }
  },
  methods: {
    handleVote: function (characterId) {
      if (this.isDummy) return;
      this.$emit('vote', this.id, characterId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.versus {
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 180px;
  max-width: 100%;

  &--grow {
    flex: 1;
  }

  &__icon {
    min-width: $versus-icon-min-width;
    height: 20px;
    padding: 0;
    border-width: 1px;
    border-radius: 50px;
    text-align: center;
    margin: auto 0;
  }

  &--column {
    flex-direction: column;

    .versus__icon {
      height: auto;
      margin: 0 auto;
    }
  }
}

$versus-stacked-spacing: 15px;

.versus__versus-card--stacked {
  height: 50%;
  width: 100%;
  margin-bottom: $versus-stacked-spacing;

  & ~ & {
    margin-top: $versus-stacked-spacing;
    margin-bottom: 0;
  }
}
</style>
