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
          @click="handleRemoveCharacter(c.id)"
        />
        <ListFigureCard
          class="comparison-card"
          figureClass="comparison-card__figure"
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
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import { ListFigureCard } from '@/components/Cards';
import Button from '@/components/Button';

import Icons from '@/constants/icons';
import Urls from '@/constants/urls';
import Strings from '@/constants/strings';
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
      compareCharacters: []
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
      return this.characters.filter((x) => !this.characterIds.includes(x.id));
    },
    characterIds: function() {
      const { characterIds } = this.$router.history.current.query;
      const str = characterIds || ',';
      return str.split(',').map((x) => (x ? Number(x) : null));
    },
    activeCharacters: function() {
      const aChara = this.characterIds.map((id, i) => {
        const c = this.compareCharacters.find((c) => c.id === id);
        if (!id || !c) return this.placeholders[i];
        return { ...c, isActive: true };
      });

      console.log(aChara, this.compareCharacters, this.characterIds);
      return aChara;
    },
    hasTwoCharacters: function() {
      return (
        this.characterIds.every((x) => !!x) && this.characterIds.length === 2
      );
    }
  },
  methods: {
    onSearchCharacters: function(value) {
      this.characterFilter = value;
    },
    onSelectCharacter: function(characterId) {
      const index = this.characterIds.findIndex((x) => x === null);
      const newQueryParam = [...this.characterIds]
        .map((x, i) => (i === index ? characterId : x || ''))
        .join(',');

      this.$nextTick(() => {
        const character = this.characters.find((x) => x.id === characterId);
        this.compareCharacters.push(character);
      });

      this.updateRoute(newQueryParam);
    },
    onTriggerQuery: function() {
      this.$apollo.queries.characters.refresh();
    },
    handleRemoveCharacter: function(characterId) {
      const newQueryParam = [...this.characterIds]
        .map((x) => (x === characterId ? '' : x || ''))
        .join(',');

      this.$nextTick(() => {
        this.compareCharacters = this.compareCharacters.filter(
          (x) => x.id !== characterId
        );
      });

      this.updateRoute(newQueryParam);
    },
    updateRoute: function(characterIds) {
      this.$router.go({
        name: Strings.route.versusComparison,
        query: { characterIds }
      });
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
</style>
<style lang="scss">
.comparison-card {
  margin: 0 auto;

  &__figure > img {
    max-height: 100px;
  }
}
</style>

<style lang="scss" src="../../styles/_page-view.scss" />
