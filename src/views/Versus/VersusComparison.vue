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
          open-new-tab
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
      compareCharacters: [],
      versusHistoryComparison: []
    };
  },
  apollo: {
    charactersByIds: {
      query: Query.getCharactersByIds,
      skip() {
        return (
          this.characterIds.every((x) => x === null) ||
          this.characterIds.every(
            (x) => !x || this.compareCharacters.some((c) => c.id === x)
          )
        );
      },
      variables() {
        return { characterIds: this.characterIds };
      },
      update(data) {
        this.compareCharacters.push(...data.charactersByIds);
      }
    },
    characters: {
      query: Query.getCharactersForVersusCompare,
      skip() {
        return !this.characterFilter;
      },
      variables() {
        return { search: this.characterFilter };
      }
    },
    versusHistoryComparison: {
      query: Query.getVersusHistoryComparison,
      manual: true,
      result({ data, loading }) {
        if (!loading) {
          console.log('history >> ', data);
        }
      }
    }
  },
  computed: {
    characterSearchResults: function() {
      return this.characters.filter((x) => !this.characterIds.includes(x.id));
    },
    characterIds: function() {
      const { characterIds } = this.$route.query;
      const str = characterIds || ',';
      return str.split(',').map((x) => (x ? Number(x) : null));
    },
    activeCharacters: function() {
      return this.characterIds.map((id, i) => {
        const c = this.compareCharacters.find((c) => c.id === id);
        if (!id || !c) return this.placeholders[i];
        return { ...c, isActive: true };
      });
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
      const character = this.characters.find((x) => x.id === characterId);
      this.compareCharacters.push(character);

      const index = this.characterIds.findIndex((x) => x === null);
      const newQueryParam = [...this.characterIds]
        .map((x, i) => (i === index ? characterId : x || ''))
        .join(',');

      this.updateRoute(newQueryParam);
      this.characterFilter = '';
    },
    onTriggerQuery: function() {
      this.$apollo.queries.versusHistoryComparison.refetch({
        characterIds: this.characterIds
      });
    },
    handleRemoveCharacter: function(characterId) {
      const newQueryParam = [...this.characterIds]
        .map((x) => (x === characterId ? '' : x || ''))
        .join(',');

      this.updateRoute(newQueryParam);
      this.compareCharacters = this.compareCharacters.filter(
        (x) => x.id !== characterId
      );
      this.versusHistoryComparison = [];
    },
    updateRoute: function(characterIds) {
      this.$router.replace({
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
    height: auto !important;
  }
}
</style>

<style lang="scss" src="../../styles/_page-view.scss" />
