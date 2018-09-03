<template>
  <div class="page page-view versus-comparison">
    <div class="versus-comparison__actions">
      <InputBoxAutocomplete
        id="characterFilter"
        name="characterFilter"
        text="Characters"
        label="search characters"
        attr="name"
        :options="characterSearchResults"
        :filter="characterFilter"
        @input="onSearchCharacters"
        @on-select="onSelectCharacter"
        disable-local-filter
      />
      <Button
        theme="primary"
        :disabled="!hasTwoCharacters"
        @click="onTriggerQuery"
      >
        Compare
      </Button>
    </div>
    <div class="versus-comparison__content">
      <div
        class="versus-comparison__item"
        v-for="c in activeCharacters"
        :key="c.id"
      >
        <Button
          v-show="c.isActive"
          class="versus-comparison__remove"
          :icon="removeIcon"
          @click="handleRemoveCharacter"
        />
        <ListFigureCard
          class="comparison-card"
          v-bind="c"
          :url-source="cardUrl"
        />
      </div>
      <div>
        PLACEHOLDERS
      </div>
    </div>
  </div>
</template>

<script>
import classNames from 'classnames';

import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import { ListFigureCard } from '@/components/Cards';
import Button from '@/components/Button';

import Icons from '@/constants/icons';
import Urls from '@/constants/urls';
import { Query } from '@/graphql';
import { createDummyCharacterCompare } from '@/utils/models';

export default {
  name: 'VersusComparison',
  components: {
    InputBoxAutocomplete,
    ListFigureCard,
    Button
  },
  data: function() {
    return {
      removeIcon: Icons.cross,
      cardUrl: Urls.characterView,
      characterFilter: '',
      characters: [],
      placeholders: [
        createDummyCharacterCompare(),
        createDummyCharacterCompare()
      ],
      compareCharacters: [null, null]
    };
  },
  apollo: {
    characters: {
      query: Query.getCharactersForVersusCompare,
      manual: true,
      skip() {
        return !this.characterFilter;
      },
      result({ data, loading }) {
        if (!loading) {
          this.characters = data.characters;
        }
      },
      variables() {
        return { search: this.characterFilter };
      }
    }
  },
  computed: {
    characterSearchResults: function() {
      return this.characters;
    },
    activeCharacters: function() {
      console.log('active chara!', this.$router, this.characters, this.placeholders);
      return this.compareCharacters.map(
        (x, i) => (x === null ? this.placeholders[i] : { ...x, isActive: true })
      );
    },
    hasTwoCharacters: function() {
      return this.compareCharacters.every((x) => x !== null);
    }
  },
  methods: {
    onSearchCharacters: function(value) {
      this.characterFilter = value;
    },
    onSelectCharacter: function(characterId) {
      const character = this.characters.find((x) => x.id === characterId);
      const index = this.compareCharacters.findIndex((x) => x === null);
      this.compareCharacters = this.compareCharacters.map(
        (x, i) => (i === index ? character : x)
      );
    },
    onTriggerQuery: function() {
      this.$apollo.queries.characters.refresh();
    },
    handleRemoveCharacter: function() {

    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.versus-comparison {
  flex-direction: column;
  &__actions {
    display: flex;
  }
  &__content {
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    position: relative;
    display: flex;
    width: 50%;
  }
  &__remove {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.comparison-card {
  margin: 0 auto;
}
</style>
<style lang="scss" src="../../styles/_page-view.scss" />
