<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view">  
      <LoadingBouncer v-show="isLoading" />
      <div class="page-view__left-column htr-column">
        <div class="htr-column__inner">
          <HTRImage 
            :src="editCharacter.displayImage" 
            class="page-view__image" 
          />
          <ViewBlockToggler
            id="displayImage"
            value="Change image"
            :lockEdit="isCreate"
            :forceReadOnly="readOnly"
          >
            <ImageUploader
              name="displayImage"
              @on-upload="handleUserChanges"
            />
          </ViewBlockToggler>
        </div>
      </div>
      <Tabs>
        <Tab name="Detail">
          <div class="page-view__content view-info">
            <header class="view-info__header">
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
                  @input="handleUserChanges"
                />
              </ViewBlockToggler>
            </header>
            <div class="view-info__content">
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
                  @on-select="handleUserChanges"
                  required
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
                  @on-select="handleUserChanges"
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
          <div class="page-view__content view-info">
            <ImageUploader
              name="galleryImage"
              @on-upload="onGalleryImageUpload"
            />
            <List 
              className="gallery"
              itemClassName="gallery__item"
              :items="editCharacter.images"
            >
              <template slot-scope="slotProps">
                <ImageCard 
                  v-bind="slotProps.item"
                  :remove="onRemoveImage"
                  hide-caption
                />
              </template>
            </List>
          </div>
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
import ImageUploader from '@/components/ImageUploader';
import LoadingBouncer from '@/components/LoadingBouncer';
import List from '@/components/List';
import { ImageCard } from '@/components/Cards';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import GenderType from '@/constants/gender-type';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual, getItemFromData, generateUniqueId } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapToSelectBoxOptions,
  mapCharacterToPost,
  mapCharacterToStore,
  mapCharacterToOptimisticCreate,
  mapCharacterToOptimisticUpdate
} from '@/utils/mappers';
import * as CacheUpdate from '@/utils/cache';
import { defaultCharacterModel } from '@/utils/models';
import * as Routing from '@/utils/routing';
import { CharacterValidator } from '@/utils/validators';

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
    Tab: HTRTabs.Tab,
    ImageUploader,
    LoadingBouncer,
    List,
    ImageCard
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
      mutationLoading: false,
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
    },
    isLoading: function() {
      console.log(this.$apollo);
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    }
  },
  methods: {
    updateData: function(data) {
      this.character = { ...data };
      this.editCharacter = { ...data };
    },
    handleUserChanges: function(value, name) {
      this.editCharacter[name] = value;
    },
    onGalleryImageUpload: function(value) {
      this.editCharacter.images.push({ id: generateUniqueId(), url: value });
    },
    onRemoveImage: function(imageId) {
      this.editCharacter.images = [
        ...this.editCharacter.images.filter((x) => x.id !== imageId)
      ];
    },
    onCreate: function(newTag) {
      this.newTags.push(newTag);

      const oldTagIds = [...this.editCharacter.tagIds];
      this.editCharacter.tagIds = [...oldTagIds, newTag.id];
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
      console.log('submitted character!');
      if (this.isCreate && CharacterValidator.isValidNew(this.editCharacter)) {
        this.handleCreate();
      } else if (CharacterValidator.isValidExisting(this.editCharacter)) {
        this.handleUpdate();
      }
    },
    handleCreate: function() {
      this.mutationLoading = true;
      const postCharacter = mapCharacterToPost(
        this.editCharacter,
        this.combinedTags
      );

      this.$apollo
        .mutate({
          mutation: Mutation.createCharacter,
          variables: { character: postCharacter },
          update: (store, { data: { characterCreate } }) => {
            const character = { ...characterCreate };
            store.deleteQueryHTR('characters');

            store.writeQuery({
              query: Query.getCharacterById,
              variables: { id: character.id },
              data: { characterById: mapCharacterToStore(character) }
            });

            CacheUpdate.refreshAllTags(store, character);
          },
          optimisticResponse: mapCharacterToOptimisticCreate(
            this.editCharacter,
            this.combinedTags
          )
        })
        .then(({ data }) => {
          const item = getItemFromData(data);
          this.updateData(item);
          this.mutationLoading = false;

          const redirectToUrl = Urls.build(Urls.characterView, { id: item.id });
          this.$router.push(redirectToUrl);
        });
    },
    handleUpdate: function() {
      this.mutationLoading = true;
      const postCharacter = mapCharacterToPost(
        this.editCharacter,
        this.combinedTags
      );

      this.$apollo
        .mutate({
          mutation: Mutation.updateCharacter,
          variables: { character: postCharacter },
          update: (store, { data: { characterUpdate } }) => {
            const data = { ...characterUpdate };

            store.writeQuery({
              query: Query.getCharacterById,
              variables: { id: postCharacter.id },
              data: { characterById: mapCharacterToStore(data) }
            });

            CacheUpdate.refreshGetCharacters(store, data);
            CacheUpdate.refreshAllTags(store, data);
          },
          optimisticResponse: mapCharacterToOptimisticUpdate(
            this.editCharacter,
            this.combinedTags
          )
        })
        .then(() => {
          this.readOnly = false; // allow edits again
          this.mutationLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" src="../../styles/_page-view.scss" />
