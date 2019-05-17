<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view">
      <LoadingBouncer v-show="isLoading" />
      <div class="page-view__left-column htr-column htr-column--image">
        <div class="htr-column__inner">
          <HTRImage
            :src="editSeries.displayImage"
            :alt="editSeries.name"
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
            <ImageUploader name="displayImage" @on-upload="handleUserChanges" />
          </ViewBlockToggler>
        </div>
      </div>
      <Tabs class="page-view__tabs" is-locked>
        <Tab name="Detail">
          <div class="page-view__content view-info">
            <header class="view-info__header">
              <ViewBlockToggler
                id="name"
                :value="series.name"
                :lock-edit="isCreate"
                :force-read-only="readOnly"
                label="Name"
              >
                <InputBox
                  id="name"
                  :value="editSeries.name"
                  name="name"
                  label="Name"
                  @input="handleUserChanges"
                />
                <div
                  v-if="checkSeriesAlreadyExists"
                  class="page-view__error-message"
                >
                  A series with this name was already exists.
                </div>
              </ViewBlockToggler>
            </header>
            <div class="view-info__content">
              <ViewBlockToggler
                id="source"
                :value="series.source"
                :lock-edit="isCreate"
                :force-read-only="readOnly"
                label="Source"
              >
                <SelectBox
                  id="source"
                  :options="mappedSources"
                  :value="editSeries.source"
                  name="source"
                  text="Source"
                  required
                  @on-select="handleUserChanges"
                />
              </ViewBlockToggler>

              <ViewBlockToggler
                id="characters"
                :lock-edit="isCreate"
                :force-read-only="readOnly"
                value="Characters"
                block-class="characters-view-block"
              >
                <InputBoxAutocomplete
                  id="characterFilter"
                  :options="characterSearchResults"
                  :filter="characterFilter"
                  name="characterFilter"
                  label="Characters"
                  attr="name"
                  disable-local-filter
                  @input="onSearchCharacters"
                  @on-select="onSelectCharacter"
                />
              </ViewBlockToggler>
              <List
                :items="editSeries.characters"
                class="characters"
                item-class-name="characters__item"
                is-grid="standard"
              >
                <template slot-scope="slotProps">
                  <ListFigureCard
                    v-bind="slotProps.item"
                    :url-source="characterCardUrl"
                  />
                </template>
              </List>
            </div>
          </div>
        </Tab>
      </Tabs>

      <template v-if="showButtons">
        <portal :to="portalTarget">
          <div class="button-group">
            <Button theme="primary" @click="cancel">Cancel</Button>
            <Button theme="secondary" @click="submit">{{
              isCreate ? 'Create' : 'Save'
            }}</Button>
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
import HTRTabs from '@/components/Tabs';
import ImageUploader from '@/components/ImageUploader';
import List from '@/components/List';
import { ListFigureCard } from '@/components/Cards';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import LoadingBouncer from '@/components/LoadingBouncer';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import SourceType from '@/constants/source-type';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual, getItemFromData } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapSeriesToPost,
  mapSeriesToStore,
  mapSeriesToOptimisticCreate,
  mapSeriesToOptimisticUpdate
} from '@/utils/mappers';
import * as CacheUpdate from '@/utils/cache';
import { defaultSeriesModel } from '@/utils/models';
import * as Routing from '@/utils/routing';
import { SeriesValidator } from '@/utils/validators';

function getInitialState() {
  return {
    viewBlockReadOnlySlot: Strings.slot.viewBlock,
    portalTarget: Strings.portal.actions,
    characterCardUrl: Urls.characterView,
    mutationLoading: false,
    readOnly: false,
    series: {},
    editSeries: defaultSeriesModel(),
    characters: [],
    characterFilter: '',
    mappedSources: mapEnumToSelectBoxOptions(SourceType),
    checkSeriesAlreadyExists: false
  };
}

export default {
  name: 'SeriesView',
  components: {
    HTRImage,
    ViewBlockToggler,
    SelectBox,
    Button,
    InputBox,
    Tabs: HTRTabs.Tabs,
    Tab: HTRTabs.Tab,
    ImageUploader,
    List,
    ListFigureCard,
    InputBoxAutocomplete,
    LoadingBouncer
  },
  props: {
    isCreate: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return getInitialState();
  },
  metaInfo() {
    if (this.isCreate) {
      return { title: 'Hotaru - Create Series' };
    }

    return {
      title: this.series && this.series.name,
      titleTemplate: 'Hotaru - View Series - %s'
    };
  },
  apollo: {
    series: {
      query: Query.getSeriesById,
      fetchPolicy: 'network-only',
      skip() {
        return this.isCreate;
      },
      variables() {
        const id = Number(Routing.getParam(this.$router, 'id'));
        return { id };
      },
      update(data) {
        const series = data.seriesById || defaultSeriesModel();
        this.editSeries = {
          ...series
        };
        return series;
      }
    },
    checkSeriesAlreadyExists: {
      query: Query.checkSeriesAlreadyExists,
      fetchPolicy: 'network-only',
      debounce: 1000,
      skip() {
        const { name } = this.editSeries;
        return !name;
      },
      variables() {
        const { id, name } = this.editSeries;
        return { id, name };
      }
    },
    characters: {
      query: Query.getCharactersWithoutSeries,
      skip() {
        return !this.characterFilter;
      },
      debounce: 1000,
      variables() {
        return { search: this.characterFilter };
      },
      update(data) {
        return data.charactersWithoutSeries;
      }
    }
  },
  computed: {
    characterSearchResults: function() {
      return this.characters.filter(
        (x) => !this.editSeries.characters.some((y) => y.id === x.id)
      );
    },
    hasEdits: function() {
      return !objectsAreEqual(this.series, this.editSeries);
    },
    showButtons: function() {
      return (!this.isCreate && this.hasEdits) || this.isCreate;
    },
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    }
  },
  watch: {
    $route: function(newRoute) {
      if (newRoute.path === Urls.seriesCreate) {
        Object.assign(this.$data, getInitialState());
      }
    }
  },
  methods: {
    updateData: function(data) {
      this.series = { ...data };
      this.editSeries = { ...data };
    },
    handleUserChanges: function(value, name) {
      this.editSeries[name] = value;
    },
    onSearchCharacters: function(value) {
      this.characterFilter = value;
    },
    onSelectCharacter: function(characterId) {
      const character = this.characters.find((x) => x.id === characterId);
      this.editSeries.characters = [...this.editSeries.characters, character];
      this.characterFilter = '';
    },
    cancel: function() {
      this.readOnly = true;
      this.characters = [];
      this.characterFilter = '';
      this.editSeries = { ...this.series };
      this.$nextTick(function() {
        this.readOnly = false;
      });
    },
    submit: function() {
      this.readOnly = true; // set back to read only.

      if (this.isCreate && SeriesValidator.isValidNew(this.editSeries)) {
        this.handleCreate();
      } else if (
        !this.isCreate &&
        SeriesValidator.isValidExisting(this.editSeries)
      ) {
        this.handleUpdate();
      } else {
        this.readOnly = false;
      }
    },
    handleCreate: function() {
      this.mutationLoading = true;
      const postSeries = mapSeriesToPost(this.editSeries);

      this.$apollo
        .mutate({
          mutation: Mutation.createSeries,
          variables: { series: postSeries },
          update: (store, { data: { seriesCreate } }) => {
            const series = { ...seriesCreate };
            store.deleteQueryHTR('series');

            store.writeQuery({
              query: Query.getSeriesById,
              variables: { id: series.id },
              data: { seriesById: mapSeriesToStore(series) }
            });
          },
          optimisticResponse: mapSeriesToOptimisticCreate(this.editSeries)
        })
        .then(({ data }) => {
          const item = getItemFromData(data);
          this.updateData(item);
          this.readOnly = false;
          this.mutationLoading = false;

          const redirectToUrl = Urls.build(Urls.seriesView, { id: item.id });
          this.$router.push(redirectToUrl);
        });
    },
    handleUpdate: function() {
      this.mutationLoading = true;
      const postSeries = mapSeriesToPost(this.editSeries);

      this.$apollo
        .mutate({
          mutation: Mutation.updateSeries,
          variables: { series: postSeries },
          update: (store, { data: { seriesUpdate } }) => {
            const series = { ...seriesUpdate };

            store.writeQuery({
              query: Query.getSeriesById,
              variables: { id: series.id },
              data: { seriesById: mapSeriesToStore(series) }
            });

            CacheUpdate.refreshSeries(store, series);
          },
          optimisticResponse: mapSeriesToOptimisticUpdate(this.editSeries)
        })
        .then(() => {
          this.readOnly = false; // allow edits again
          this.mutationLoading = false;
        });
    }
  }
};
</script>

<style lang="scss">
// try not to do this, but I'll give this case a pass
.characters-view-block > .button {
  font-weight: bold;
  margin-left: -5px;
}

.characters__item {
  flex: 0 0 24%;
}
</style>

<style lang="scss" src="../../styles/_page-view.scss" />
