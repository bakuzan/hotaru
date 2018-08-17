<template>
  <div class="page character-view">
      <div class="character-view__left-column">
        <HTRImage 
          :src="character.displayImage" 
          class="character-view__image" 
        />
      </div>
      <section class="character-view__content character-info">
        <header class="character-info__header header">
          <h4 class="header__title">{{character.name}}</h4>
          <span>{{character.gender}}</span>
        </header>
        <div class="character-info__content">
          <ViewBlockToggler
            id="series"
            label="Series"
            :value="characterSeries"
            :noDataText="noSeries"
            :lockEdit="isCreate"
            :forceReadOnly="readOnly"
          >
            <SelectBox
                id="series"
                name="seriesId"
                text="Series"
                :options="mappedSeries"
                :value="editCharacter.seriesId"
                @on-select="onChange"
            />
          </ViewBlockToggler>
          <div class="view-block view-block--read-only">
            - tags?
            - gallery?
            - ranking info?
          </div>
          
        </div>
      </section>
      <template v-if="hasEdits">
        <portal :to="portalTarget">
          <Button
            theme="secondary"
            @click="submit"
          >
            Save
          </Button>
        </portal>
      </template>
  </div>
</template>

<script>
import HTRImage from '@/components/HTRImage';
import ViewBlockToggler from '@/components/ViewBlockToggler';
import SelectBox from '@/components/SelectBox';
import Button from '@/components/Button';

import Strings from '@/constants/strings';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual } from '@/utils';
import {
  mapToSelectBoxOptions,
  mapCharacterToPost,
  mapCharacterToOptimisticUpdate
} from '@/utils/mappers';
import * as Routing from '@/utils/routing';

export default {
  name: 'CharactersView',
  components: {
    HTRImage,
    ViewBlockToggler,
    SelectBox,
    Button
  },
  data: function() {
    return {
      readOnly: false,
      editCharacter: {},
      character: {},
      series: []
    };
  },
  apollo: {
    character: {
      query: Query.getCharacterById,
      variables() {
        const id = Number(Routing.getParam(this.$router, 'id'));
        return { id };
      },
      update(data) {
        const character = data.characterById || {};
        this.editCharacter = {
          ...character
        };
        return character;
      }
    },
    series: {
      query: Query.allSeries
    }
  },
  computed: {
    isCreate: function() {
      const routeName = Routing.getRouteName(this.$router);
      return routeName === Strings.route.characterCreate;
    },
    mappedSeries: function() {
      return mapToSelectBoxOptions(this.series);
    },
    characterSeries: function() {
      const { seriesId } = this.character;
      const series = this.series.find((x) => x.id === seriesId) || {};
      return series.name;
    },
    noSeries: function() {
      return Strings.missing.series;
    },
    hasEdits: function() {
      return !objectsAreEqual(this.character, this.editCharacter);
    },
    portalTarget: function() {
      return Strings.portal.actions;
    }
  },
  methods: {
    onChange: function(value, name) {
      this.editCharacter[name] = value;
    },
    submit: function() {
      this.readOnly = true; // set back to read only.

      const postCharacter = mapCharacterToPost(this.editCharacter);
      this.$apollo
        .mutate({
          mutation: Mutation.updateCharacter,
          variables: { character: postCharacter },
          update: (store, { data: { characterUpdate } }) => {
            const oldData = store.readQuery({
              query: Query.getCharacterById,
              variables: { id: postCharacter.id }
            });

            const data = { ...oldData, ...characterUpdate };

            store.writeQuery({
              query: Query.getCharacterById,
              variables: { id: postCharacter.id },
              data
            });
          },
          optimisticResponse: mapCharacterToOptimisticUpdate(postCharacter)
        })
        .then(() => {
          this.readOnly = false; // allow edits again
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables';

.character-view {
  display: flex;

  &__image {
    max-height: 300px;
    margin-left: 0;
  }

  &__left-column {
    display: flex;
    flex-basis: 20%;
    padding: $app--standard-padding;
  }
  &__content {
    display: flex;
    flex-basis: 80%;
    flex-direction: column;
  }
}

.header {
  margin: $app--standard-margin 0;

  &__title {
    margin: $app--standard-margin 0;
  }
}
</style>
