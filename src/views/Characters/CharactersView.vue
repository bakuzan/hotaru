<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view">
      <LoadingBouncer v-show="isLoading" />
      <div class="page-view__left-column htr-column htr-column--image">
        <div class="htr-column__inner">
          <HTRImage
            :src="editCharacter.displayImage"
            :alt="editCharacter.name"
            force-load
            suffix="m"
            class="page-view__image"
          />
          <ViewBlockToggler
            id="displayImage"
            :lock-edit="isCreate"
            :force-read-only="readOnly"
            class="span-column"
            value="Change image"
          >
            <InputBox
              v-if="showImageInput"
              id="displayImageInput"
              name="displayImage"
              label="Display Image Url"
              :value="editCharacter.displayImage"
              clear-button-class
              @input="handleUserChanges"
            />
            <ImageUploader
              v-else
              name="displayImage"
              @on-upload="handleUserChanges"
            />

            <Button
              id="toggleImageInput"
              :icon="toggleImageIcon"
              class="toggle-button"
              theme="primary"
              @click="toggleImageInput"
            />
          </ViewBlockToggler>
          <TickboxHeart
            id="isWaifu"
            :checked="!!editCharacter.isWaifu"
            class="span-column"
            name="isWaifu"
            text="Is Waifu"
            @change="handleUserChanges"
          />
        </div>
      </div>
      <Tabs class="page-view__tabs" @updated="handleTabChange">
        <Tab name="Detail">
          <div class="page-view__content view-info">
            <header class="view-info__header">
              <ViewBlockToggler
                id="name"
                :value="character.name"
                :lock-edit="isCreate"
                :force-read-only="readOnly"
                label="Name"
              >
                <InputBox
                  id="name"
                  :value="editCharacter.name"
                  name="name"
                  label="Name"
                  @input="handleUserChanges"
                />
                <div
                  v-if="checkCharacterAlreadyExists"
                  class="page-view__error-message"
                >
                  A character with this name was already exists.
                </div>
              </ViewBlockToggler>
            </header>
            <div class="view-info__content">
              <ViewBlockToggler
                id="gender"
                :value="character.gender"
                :lock-edit="isCreate"
                :force-read-only="readOnly"
                label="Gender"
              >
                <SelectBox
                  id="gender"
                  :options="mappedGenders"
                  :value="editCharacter.gender"
                  name="gender"
                  text="Gender"
                  required
                  @on-select="handleUserChanges"
                />
              </ViewBlockToggler>
              <div class="character-toggler-wrapper">
                <ViewBlockToggler
                  id="series"
                  :value="characterSeries"
                  :no-data-text="noSeries"
                  :lock-edit="isCreate"
                  :force-read-only="readOnly"
                  label="Series"
                >
                  <SelectBox
                    id="series"
                    :options="mappedSeries"
                    :value="editCharacter.seriesId"
                    name="seriesId"
                    text="Series"
                    required
                    @on-select="handleUserChanges"
                  />
                </ViewBlockToggler>
                <div
                  v-show="editCharacter.seriesId"
                  class="character-toggler-wrapper__icon"
                >
                  <NavLink :to="seriesUrl" name="Link to series">
                    <LinkImages />
                  </NavLink>
                </div>
              </div>
              <ViewBlockToggler
                id="tags"
                :value="characterTags"
                :no-data-text="noTags"
                :lock-edit="isCreate"
                :force-read-only="readOnly"
                label="Tags"
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
                  :options="combinedTags"
                  :values="editCharacterTags"
                  name="tagIds"
                  text="Tags"
                  allow-nulls
                  @update="onUpdate"
                  @create="onCreate"
                />
              </ViewBlockToggler>
            </div>
          </div>
        </Tab>
        <Tab name="Gallery">
          <div class="page-view__content view-info">
            <div class="gallery-controls">
              <div v-if="showGalleryImageInput" class="gallery-controls__input">
                <InputBox
                  id="galleryImageInput"
                  :value="galleryImage"
                  name="galleryImage"
                  label="Gallery Image Url"
                  class
                  clear-button-class
                  @input="galleryImage = $event"
                />
                <Button
                  id="addGalleryImage"
                  :icon="addImageIcon"
                  class="add-to-gallery-button"
                  theme="primary"
                  title="Add url to gallery"
                  aria-label="Add url to gallery"
                  @click="onGalleryImageUpload(galleryImage)"
                />
              </div>
              <ImageUploader
                v-else
                name="galleryImage"
                @on-upload="onGalleryImageUpload"
              />

              <Button
                id="toggleGalleryImageInput"
                :icon="toggleImageIcon"
                class="toggle-button"
                theme="primary"
                @click="toggleGalleryImageInput"
              />
            </div>

            <List
              :items="characterImages"
              class="gallery"
              item-class-name="gallery__item"
              is-grid="standard"
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
        <Tab :is-disabled="isCreate" name="Versus">
          <div class="page-view__content view-info">
            <List
              :items="versusHistoryPaged.nodes"
              :paged-total="versusHistoryPaged.total"
              columns="one"
              @intersect="showMore"
            >
              <template slot-scope="slotProps">
                <VersusHistoryCard
                  :character-id="editCharacter.id"
                  :item="slotProps.item"
                />
              </template>
            </List>
          </div>
        </Tab>
      </Tabs>

      <template v-if="showButtons">
        <portal :to="portalTarget">
          <div class="button-group">
            <Button theme="primary" @click="cancel">Cancel</Button>
            <Button theme="secondary" @click="submit">
              {{ isCreate ? 'Create' : 'Save' }}
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
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';
import InputBoxChipList from '@/components/InputBoxChipList';
import InputBoxChipListTag from '@/components/InputBoxChipListTag';
import HTRTabs from '@/components/Tabs';
import ImageUploader from '@/components/ImageUploader';
import LoadingBouncer from '@/components/LoadingBouncer';
import List from '@/components/List';
import { ImageCard, VersusHistoryCard } from '@/components/Cards';
import TickboxHeart from '@/components/TickboxHeart';
import NavLink from '@/components/NavLink';
import LinkImages from '@/components/LinkImages';

import Strings from '@/constants/strings';
import Icons from '@/constants/icons';
import Urls from '@/constants/urls';
import GenderType from '@/constants/genderType';
import { Query, Mutation } from '@/graphql';
import {
  objectsAreEqual,
  getItemFromData,
  generateUniqueId,
  createErrorStringFromGraphql
} from '@/utils';
import alertService from '@/utils/alertService';
import {
  mapEnumToSelectBoxOptions,
  mapToSelectBoxOptions,
  mapCharacterToPost,
  mapCharacterToStore,
  mapCharacterToOptimisticCreate,
  mapCharacterToOptimisticUpdate
} from '@/utils/mappers';
import * as CacheUpdate from '@/utils/cache';
import { defaultCharacterModel, defaultPagedResponse } from '@/utils/models';
import * as Routing from '@/utils/routing';
import { CharacterValidator } from '@/utils/validators';
import * as LP from '@/utils/list-pages';

function getInitialState() {
  return {
    viewBlockReadOnlySlot: Strings.slot.viewBlock,
    noSeries: Strings.missing.series,
    noTags: Strings.missing.tags,
    portalTarget: Strings.portal.actions,
    lightThemes: ['one'],
    mappedGenders: mapEnumToSelectBoxOptions(GenderType),
    toggleImageIcon: Icons.upDown,
    addImageIcon: '+',
    showImageInput: true,
    showGalleryImageInput: true,
    mutationLoading: false,
    readOnly: false,
    editCharacter: defaultCharacterModel(),
    originalImages: null,
    character: {},
    newTags: [],
    versusHistoryPaged: {
      ...defaultPagedResponse(),
      hasMore: false
    },
    checkCharacterAlreadyExists: false,
    galleryImage: ''
  };
}

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
    ImageCard,
    TickboxHeart,
    VersusHistoryCard,
    NavLink,
    LinkImages
  },
  props: {
    isCreate: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      series: [],
      tags: [],
      ...getInitialState()
    };
  },
  metaInfo() {
    if (this.isCreate) {
      return { title: 'Create Character | Hotaru' };
    }

    return {
      title: this.character && this.character.name,
      titleTemplate: 'View Character - %s | Hotaru'
    };
  },
  apollo: {
    character: {
      query: Query.getCharacterById,
      fetchPolicy: 'network-only',
      skip() {
        return this.isCreate;
      },
      variables() {
        const id = Number(Routing.getParam(this.$router, 'id'));
        return { id };
      },
      update(data) {
        const oldCharacter = this.editCharacter;
        const character = data.characterById || defaultCharacterModel();
        const currentValues =
          !oldCharacter.id || oldCharacter.id === character.id
            ? oldCharacter
            : defaultCharacterModel();

        this.editCharacter = {
          ...currentValues,
          ...character,
          tagIds: [...character.tagIds]
        };
        return { ...character };
      }
    },
    checkCharacterAlreadyExists: {
      query: Query.checkCharacterAlreadyExists,
      fetchPolicy: 'network-only',
      debounce: 1000,
      skip() {
        const { name, seriesId } = this.editCharacter;
        return !(name && seriesId);
      },
      variables() {
        const { id, name, seriesId } = this.editCharacter;
        return { id, name, seriesId: Number(seriesId) };
      }
    },
    series: {
      query: Query.allSeries
    },
    tags: {
      query: Query.allTags
    },
    versusHistoryPaged: {
      query: Query.getVersusHistory,
      skip: true,
      variables() {
        return {
          characterId: this.characterId,
          paging: {
            page: 0,
            size: LP.size
          }
        };
      }
    },
    imagesForCharacter: {
      query: Query.getImagesForCharacter,
      skip: true,
      manual: true,
      variables() {
        return {
          characterId: this.characterId
        };
      },
      result(result) {
        const { data } = result;
        const currentImages = this.editCharacter.images || [];
        const images = [
          ...currentImages,
          ...data.characterImages.filter((x) =>
            currentImages.every((y) => y.id !== x.id)
          )
        ];

        this.originalImages = [...images];
        this.$set(this.editCharacter, 'images', [...images]);
      }
    }
  },
  computed: {
    characterId: function () {
      return +Routing.getParam(this.$router, 'id');
    },
    mappedSeries: function () {
      return mapToSelectBoxOptions(this.series);
    },
    combinedTags: function () {
      const tags = [...this.tags, ...this.newTags];
      const ids = new Set(tags.map((x) => x.id));
      return Array.from(ids).map((id) => tags.find((x) => x.id === id));
    },
    characterSeries: function () {
      const { seriesId } = this.character;
      const series = this.series.find((x) => x.id === seriesId) || {};
      return series.name;
    },
    characterTags: function () {
      let tagIds = this.character.tagIds || this.character.tags;
      tagIds = (tagIds || []).map((x) => (typeof x === 'object' ? x.id : x));
      const tags = this.tags.filter((x) => tagIds.includes(x.id));
      return tags;
    },
    editCharacterTags: function () {
      let tagIds = this.editCharacter.tagIds || this.editCharacter.tags;
      tagIds = (tagIds || []).map((x) => (typeof x === 'object' ? x.id : x));
      const tags = this.combinedTags.filter((x) => tagIds.includes(x.id));
      return tags;
    },
    hasEdits: function () {
      const resolvedImages = this.editCharacter.images
        ? { images: [...this.editCharacter.images] }
        : {};

      const combinedCharacter = {
        ...this.character,
        ...resolvedImages
      };

      const notEqual = !objectsAreEqual(combinedCharacter, this.editCharacter);

      const imageChange =
        this.originalImages &&
        this.editCharacter.images &&
        (this.originalImages.length !== this.editCharacter.images.length ||
          !this.originalImages.every((x) =>
            this.editCharacter.images.some((y) => x.id === y.id)
          ));

      return notEqual || imageChange;
    },
    showButtons: function () {
      const canShow = (!this.isCreate && this.hasEdits) || this.isCreate;
      return canShow && !this.checkCharacterAlreadyExists;
    },
    isLoading: function () {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    characterImages: function () {
      const images = this.editCharacter.images || [];
      return [...images];
    },
    seriesUrl: function () {
      const seriesId = this.editCharacter.seriesId || null;
      if (!seriesId) return Urls.seriesList;
      return Urls.build(Urls.seriesView, { id: seriesId });
    }
  },
  watch: {
    $route: function (newRoute, oldRoute) {
      if (newRoute.path === Urls.characterCreate) {
        if (oldRoute && oldRoute.path !== Urls.characterCreate) {
          Object.assign(this.$data, getInitialState());
        }
      }

      const differentId = newRoute.params.id !== oldRoute.params.id;

      if (differentId) {
        const tabHash = newRoute.hash;
        const id = Number(Routing.getParam(this.$router, 'id'));

        if (id) {
          this.$apollo.queries.character.refetch({ id });
        }

        if (tabHash === '#versus' && id) {
          this.$apollo.queries.versusHistoryPaged.refetch({ characterId: id });
        } else if (tabHash === '#gallery' && id) {
          this.$apollo.queries.imagesForCharacter.refetch({ characterId: id });
        }
      }
    }
  },
  mounted() {
    const params = this.$route.query;
    if (params && params.seriesId) {
      this.editCharacter.seriesId = Number(params.seriesId);
    }
  },
  methods: {
    updateData: function (data) {
      const resolvedImages = data.images ? { images: [...data.images] } : {};

      this.originalImages = [...(data.images || [])];
      this.character = { ...data, ...resolvedImages };
      this.editCharacter = { ...data, ...resolvedImages };
    },
    toggleImageInput: function () {
      this.showImageInput = !this.showImageInput;
    },
    toggleGalleryImageInput: function () {
      this.showGalleryImageInput = !this.showGalleryImageInput;
    },
    handleUserChanges: function (value, name) {
      this.editCharacter[name] = value;

      if (name === 'displayImage') {
        this.showImageInput = true;
      }
    },
    onGalleryImageUpload: function (value) {
      if (!value) {
        return;
      }

      const newImage = { id: generateUniqueId(), url: value };
      const currentImages = this.editCharacter.images || [];
      const index = currentImages.length;

      this.$set(this.editCharacter.images, index, newImage);
      this.galleryImage = '';
    },
    onRemoveImage: function (imageId) {
      this.editCharacter.images = [
        ...this.editCharacter.images.filter((x) => x.id !== imageId)
      ];
    },
    onCreate: function (newTag) {
      this.newTags.push(newTag);

      const oldTagIds = [...this.editCharacter.tagIds];
      this.editCharacter.tagIds = [...oldTagIds, newTag.id];
    },
    onUpdate: function (value, name) {
      this.editCharacter[name] = value.map((x) => x.id);
    },
    cancel: function () {
      this.readOnly = true;
      this.newTags = [];
      this.editCharacter = { ...this.character };
      this.$nextTick(function () {
        this.readOnly = false;
      });
    },
    submit: function () {
      this.readOnly = true; // set back to read only.

      if (this.isCreate && CharacterValidator.isValidNew(this.editCharacter)) {
        this.handleCreate();
      } else if (
        !this.isCreate &&
        CharacterValidator.isValidExisting(this.editCharacter)
      ) {
        this.handleUpdate();
      } else {
        this.readOnly = false;
      }
    },
    handleCreate: function () {
      this.mutationLoading = true;
      const postCharacter = mapCharacterToPost(
        this.editCharacter,
        this.combinedTags
      );

      this.$apollo
        .mutate({
          mutation: Mutation.createCharacter,
          variables: {
            character: postCharacter,
            withImages: !!this.editCharacter.images
          },
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
          this.readOnly = false;
          this.mutationLoading = false;

          const redirectToUrl = Urls.build(Urls.characterView, { id: item.id });
          this.$router.push(redirectToUrl);
        })
        .catch((error) => {
          this.readOnly = false;
          this.mutationLoading = false;

          alertService.sendError({
            message: 'Failed to create character',
            detail: createErrorStringFromGraphql(error)
          });
        });
    },
    handleUpdate: function () {
      this.mutationLoading = true;
      const postCharacter = mapCharacterToPost(
        this.editCharacter,
        this.combinedTags
      );

      this.$apollo
        .mutate({
          mutation: Mutation.updateCharacter,
          variables: {
            character: postCharacter,
            withImages: !!this.editCharacter.images
          },
          update: (store, { data: { characterUpdate } }) => {
            const data = { ...characterUpdate };

            store.writeQuery({
              query: Query.getCharacterById,
              variables: { id: postCharacter.id },
              data: { characterById: mapCharacterToStore(data) }
            });

            CacheUpdate.refreshCharacter(store, data);
            CacheUpdate.refreshAllTags(store, data);
          },
          optimisticResponse: mapCharacterToOptimisticUpdate(
            this.editCharacter,
            this.combinedTags
          )
        })
        .then(({ data }) => {
          const item = getItemFromData(data);
          this.updateData(item);
          this.readOnly = false; // allow edits again
          this.mutationLoading = false;
        })
        .catch((error) => {
          this.readOnly = false;
          this.mutationLoading = false;

          alertService.sendError({
            message: 'Failed to update character',
            detail: createErrorStringFromGraphql(error)
          });
        });
    },
    handleTabChange: function (tabHash) {
      const id = Number(Routing.getParam(this.$router, 'id'));
      const hasId = !!id;
      const isVersusTab = tabHash === '#versus';
      const isImagesTab = tabHash === '#gallery';

      this.$apollo.queries.versusHistoryPaged.skip = !hasId || !isVersusTab;
      this.$apollo.queries.imagesForCharacter.skip = !hasId || !isImagesTab;
    },
    showMore: function () {
      LP.showMore(this, 'versusHistoryPaged', 'VersusPage');
    }
  }
};
</script>

<style lang="scss" scoped>
.character-toggler-wrapper {
  display: flex;
  align-items: center;

  > div:not(.character-toggler-wrapper__icon):not(.view-block-toggler--read-only) {
    display: flex;
    flex: 1;
  }
}

.gallery-controls {
  display: flex;
  width: 100%;

  > div {
    flex: 1;
  }

  &__input {
    display: flex;
    flex: 1;
  }
}

.add-to-gallery-button {
  min-width: 20px;
  max-height: 40px;
  padding: 2px;
  margin: 2px;
}
</style>
<style lang="scss" src="../../styles/_page-view.scss" />
