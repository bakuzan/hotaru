<template>
  <form novalidate>
    <div class="page character-view">  
      <div class="character-view__left-column">
        <HTRImage 
          :src="character.displayImage" 
          class="character-view__image" 
        />
      </div>

      <Tabs>
        <Tab name="Detail">
          <div class="character-view__content character-info">
            <header class="character-info__header header">
              <ViewBlockToggler
                id="name"
                label="Name"
                :value="character.name"
                :lockEdit="isCreate"
                :forceReadOnly="readOnly"
              >
                <InputBox
                  id="name"
                  name="name"
                  label="Name"
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
                <div :slot="viewBlockReadOnlySlot" slot-scope="{ value }">
                  <InputBoxChipListTag
                    v-for="tag in value"
                    :key="tag.id"
                    :data="tag"
                    :is-active="false"
                  />
                </div>
                <InputBoxChipList
                    id="tags"
                    name="tagIds"
                    text="Tags"
                    :options="combinedTags"
                    :values="editCharacterTags"
                    @update="onUpdate"
                    @create="onCreate"
                    allowNulls
                />
              </ViewBlockToggler>
            </div>
          </div>
        </Tab>
        <Tab name="Gallery">
          Placeholder
        </Tab>
      </Tabs>

      <template v-if="showButtons">
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
              {{ isCreate ? "Create" : "Save" }}
            </Button>
          </div>
        </portal>
      </template>
    </div>
  </form>
</template>

<script>
import HTRImage from '@/components/HTRImage';
import ViewBlockToggler from '@/components/ViewBlockToggler';
import SelectBox from '@/components/SelectBox';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import InputBoxChipList from '@/components/InputBoxChipList';
import InputBoxChipListTag from '@/components/InputBoxChipListTag';
import HTRTabs from '@/components/Tabs';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import GenderType from '@/constants/gender-type';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual, getItemFromData } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapToSelectBoxOptions,
  mapCharacterToPost,
  mapCharacterToStore,
  mapCharacterToOptimisticCreate,
  mapCharacterToOptimisticUpdate
} from '@/utils/mappers';
import { refreshAllTags } from '@/utils/cache';
import { defaultCharacterModel } from '@/utils/models';
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
    InputBoxChipListTag,
    Tabs: HTRTabs.Tabs,
    Tab: HTRTabs.Tab
  },
  props: {
    isCreate: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      viewBlockReadOnlySlot: Strings.slot.viewBlock,
      noSeries: Strings.missing.series,
      noTags: Strings.missing.tags,
      portalTarget: Strings.portal.actions,
      readOnly: false,
      editCharacter: defaultCharacterModel(),
      character: {},
      series: [],
      tags: [],
      newTags: []
    };
  },
  apollo: {
    character: {
      query: Query.getCharacterById,
      skip() {
        return this.isCreate;
      },
      variables() {
        const id = Number(Routing.getParam(this.$router, 'id'));
        return { id };
      },
      update(data) {
        const character = data.characterById || defaultCharacterModel();
        this.editCharacter = {
          ...character,
          tagIds: [...character.tagIds]
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
    mappedSeries: function() {
      return mapToSelectBoxOptions(this.series);
    },
    combinedTags: function() {
      return [...this.tags, ...this.newTags];
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
      const tags = this.combinedTags.filter((x) => tagIds.includes(x.id));
      return tags;
    },
    hasEdits: function() {
      const notEqual = !objectsAreEqual(this.character, this.editCharacter);
      console.log(this.character, this.editCharacter, notEqual);
      return notEqual;
    },
    showButtons: function() {
      return (!this.isCreate && this.hasEdits) || this.isCreate;
    }
  },
  methods: {
    updateData: function(data) {
      this.character = { ...data };
      this.editCharacter = { ...data };
    },
    onChange: function(value, name) {
      this.editCharacter[name] = value;
    },
    onCreate: function(newTag) {
      this.newTags.push(newTag);

      const oldTags = [...this.editCharacter.tagIds];
      this.editCharacter.tagIds = [...oldTags, newTag.id];
    },
    onUpdate: function(value, name) {
      this.editCharacter[name] = value.map((x) => x.id);
    },
    cancel: function() {
      this.readOnly = true;
      this.newTags = [];
      this.editCharacter = { ...this.character };
      this.$nextTick(function() {
        this.readOnly = false;
      });
    },
    submit: function() {
      this.readOnly = true; // set back to read only.

      if (this.isCreate) {
        this.handleCreate();
      } else {
        this.handleUpdate();
      }
    },
    handleCreate: function() {
      const postCharacter = mapCharacterToPost(
        this.editCharacter,
        this.series,
        this.combinedTags
      );

      this.$apollo
        .mutate({
          mutation: Mutation.createCharacter,
          variables: { character: postCharacter },
          update: (store, { data: { characterCreate } }) => {
            const character = { ...characterCreate };

            refreshAllTags(store, character);

            store.writeQuery({
              query: Query.getCharacterById,
              variables: { id: character.id },
              data: mapCharacterToStore(character)
            });
          },
          optimisticResponse: mapCharacterToOptimisticCreate(postCharacter)
        })
        .then(({ data }) => {
          const item = getItemFromData(data);
          this.updateData(item);

          const redirectToUrl = Urls.build(Urls.characterView, { id: item.id });
          this.$router.push(redirectToUrl);
        });
    },
    handleUpdate: function() {
      const postCharacter = mapCharacterToPost(
        this.editCharacter,
        this.series,
        this.combinedTags
      );

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

            refreshAllTags(store, data);

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
    margin: {
      left: 0;
      top: 0;
    }
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
