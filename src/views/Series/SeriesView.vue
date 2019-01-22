<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view">
      <LoadingBouncer v-show="isLoading"/>
      <div class="page-view__left-column htr-column htr-column--image">
        <div class="htr-column__inner">
          <HTRImage force-load :src="editSeries.displayImage" class="page-view__image"/>
          <ViewBlockToggler
            id="displayImage"
            class="span-column"
            value="Change image"
            :lockEdit="isCreate"
            :forceReadOnly="readOnly"
          >
            <ImageUploader name="displayImage" @on-upload="handleUserChanges"/>
          </ViewBlockToggler>
        </div>
      </div>
      <Tabs class="page-view__tabs" is-locked>
        <Tab name="Detail">
          <div class="page-view__content view-info">
            <header class="view-info__header">
              <ViewBlockToggler
                id="name"
                label="Name"
                :value="series.name"
                :lockEdit="isCreate"
                :forceReadOnly="readOnly"
              >
                <InputBox
                  id="name"
                  name="name"
                  label="Name"
                  :value="editSeries.name"
                  @input="handleUserChanges"
                />
              </ViewBlockToggler>
            </header>
            <div class="view-info__content">
              <ViewBlockToggler
                id="source"
                label="Source"
                :value="series.source"
                :lockEdit="isCreate"
                :forceReadOnly="readOnly"
              >
                <SelectBox
                  id="source"
                  name="source"
                  text="Source"
                  :options="mappedSources"
                  :value="editSeries.source"
                  @on-select="handleUserChanges"
                  required
                />
              </ViewBlockToggler>

              <ViewBlockToggler
                id="characters"
                value="Characters"
                blockClass="characters-view-block"
                :lockEdit="isCreate"
                :forceReadOnly="readOnly"
              >
                <InputBoxAutocomplete
                  id="characterFilter"
                  name="characterFilter"
                  label="Characters"
                  attr="name"
                  :options="characterSearchResults"
                  :filter="characterFilter"
                  @input="onSearchCharacters"
                  @on-select="onSelectCharacter"
                  disable-local-filter
                />
              </ViewBlockToggler>
              <List
                class="characters"
                itemClassName="characters__item"
                is-grid="standard"
                :items="editSeries.characters"
              >
                <template slot-scope="slotProps">
                  <ListFigureCard
                    v-bind="slotProps.item"
                    :remove="onRemoveCharacter"
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
            <Button @click="cancel">Cancel</Button>
            <Button theme="secondary" @click="submit">{{ isCreate ? "Create" : "Save" }}</Button>
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
    mappedSources: mapEnumToSelectBoxOptions(SourceType)
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
  watch: {
    $route: function(newRoute) {
      if (newRoute.path === Urls.seriesCreate) {
        Object.assign(this.$data, getInitialState());
      }
    }
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
    onRemoveCharacter: function(characterId) {
      this.editSeries.characters = [
        ...this.editSeries.characters.filter((x) => x.id !== characterId)
      ];
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
