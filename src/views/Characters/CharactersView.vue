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
          <ViewBlockToggler
            id="name"
            label="Name"
            :value="character.name"
            :lockEdit="isCreate"
            :forceReadOnly="readOnly"
          >
              <h4 :slot="viewBlockReadOnlySlot" slot-scope="{ value }" class="header__title">
                {{value}}
              </h4>
              <InputBox
                id="name"
                name="name"
                text="Name"
                :value="editCharacter.name"
                @input="onChange"
              />
          </ViewBlockToggler>
        </header>
        <div class="character-info__content">
          <ViewBlockToggler
            id="gender"
            label="Gender"
            :value="character.gender"
            :lockEdit="isCreate"
            :forceReadOnly="readOnly"
          >
            <SelectBox
                id="gender"
                name="gender"
                text="Gender"
                :options="mappedGenders"
                :value="editCharacter.gender"
                @on-select="onChange"
            />
          </ViewBlockToggler>
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
            <template :slot="viewBlockReadOnlySlot" slot-scope="{ value }">
              <InputBoxChipListTag
                v-for="tag in value"
                :key="tag.id"
                :data="tag"
                is-active="false"
              />
            </template>
              <InputBoxChipList
                  id="tags"
                  name="tagIds"
                  text="Tags"
                  :options="mappedTags"
                  :values="editCharacterTags"
                  @update="onUpdate"
                  allowNulls
              />
          </ViewBlockToggler>
        </div>
      </section>
      <template v-if="hasEdits">
        <portal :to="portalTarget">
          <div class="button-group">
            <Button
              @click="cancel"
            >
              Cancel
            </Button>
            <Button
              theme="secondary"
              @click="submit"
            >
              Save
            </Button>
          </div>
        </portal>
      </template>
  </div>
</template>

<script>
import HTRImage from '@/components/HTRImage';
import ViewBlockToggler from '@/components/ViewBlockToggler';
import SelectBox from '@/components/SelectBox';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import InputBoxChipList from '@/components/InputBoxChipList';
import InputBoxChipListTag from '@/components/InputBoxChipListTag';

import Strings from '@/constants/strings';
import GenderType from '@/constants/gender-type';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
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
    Button,
    InputBox,
    InputBoxChipList,
    InputBoxChipListTag
  },
  data: function() {
    return {
      viewBlockReadOnlySlot: Strings.slot.viewBlock,
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
      return this.tags;
    },
    mappedGenders: function() {
      return mapEnumToSelectBoxOptions(GenderType);
    },
    characterSeries: function() {
      const { seriesId } = this.character;
      const series = this.series.find((x) => x.id === seriesId) || {};
      return series.name;
    },
    characterTags: function() {
      const tagIds = this.character.tagIds || [];
      const tags = this.tags.filter((x) => tagIds.includes(x.id));
      return tags;
    },
    editCharacterTags: function() {
      const tagIds = this.editCharacter.tagIds || [];
      const tags = this.tags.filter((x) => tagIds.includes(x.id));
      return tags;
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
    onUpdate: function(value, name) {
      this.editCharacter[name] = value.map((x) => x.id);
    },
    cancel: function() {
      this.editCharacter = { ...this.character };
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
    padding: $app--padding-standard;
  }
  &__content {
    display: flex;
    flex-basis: 80%;
    flex-direction: column;
  }
}

.header {
  margin: $app--margin-standard 0;

  &__title {
    margin: $app--margin-standard 0;
  }
}
</style>
