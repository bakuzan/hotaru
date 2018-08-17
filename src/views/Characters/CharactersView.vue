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
                allowNulls
            />
          </ViewBlockToggler>
          <ViewBlockToggler
            id="tags"
            label="Tags"
            :value="characterTags"
            :noDataText="noTags"
            :lockEdit="isCreate"
            :forceReadOnly="readOnly"
          >
            <SelectBox
                id="tags"
                name="tagIds"
                text="Tags"
                :options="mappedTags"
                :value="editCharacter.tagIds"
                @on-select="onChange"
                allowNulls
            />
          </ViewBlockToggler>
          <div class="view-block view-block--read-only">
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
      series: [],
      tags: []
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
    },
    tags: {
      query: Query.allTags
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
    mappedTags: function() {
      return mapToSelectBoxOptions(this.tags);
    },
    characterSeries: function() {
      const { seriesId } = this.character;
      const series = this.series.find((x) => x.id === seriesId) || {};
      return series.name;
    },
    characterTags: function() {
      const tagIds = this.character.tagIds || [];
      const tags = this.tags.filter((x) => tagIds.includes(x.id));
      console.log(tags);
      return 0; //return tags; TODO make multiselector
    },
    noSeries: function() {
      return Strings.missing.series;
    },
    noTags: function() {
      return Strings.missing.tags;
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
