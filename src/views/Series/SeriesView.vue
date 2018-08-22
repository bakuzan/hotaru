<template>
  <form novalidate>
    <div class="page page-view">
   <div class="page-view__left-column">
        <HTRImage 
          :src="series.displayImage" 
          class="page-view__image" 
        />
        <ImageUploader
        />
      </div>

      <Tabs is-locked>
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
                  @input="onChange"
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
                  @on-select="onChange"
                />
              </ViewBlockToggler>

              <!--
                TODO

                Specialised read-only toggler for the character list.
                Using Autocomplete to query characters and a list to display them.
              -->
            </div>
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
import HTRTabs from '@/components/Tabs';
import ImageUploader from '@/components/ImageUploader';

import Strings from '@/constants/strings';
import SourceType from '@/constants/source-type';
import { Query } from '@/graphql';
import { objectsAreEqual } from '@/utils';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';
import { defaultSeriesModel } from '@/utils/models';
import * as Routing from '@/utils/routing';

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
    ImageUploader
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
      portalTarget: Strings.portal.actions,
      readOnly: false,
      series: {},
      editSeries: defaultSeriesModel(),
      characters: [],
      characterFilter: ''
    };
  },
  apollo: {
    series: {
      query: Query.getSeriesById,
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
      query: Query.getCharacters,
      skip() {
        return !this.characterFilter;
      },
      debounce: 1000,
      variables() {
        return { search: this.characterFilter };
      }
    }
  },
  computed: {
    mappedSources: function() {
      return mapEnumToSelectBoxOptions(SourceType);
    },
    hasEdits: function() {
      return !objectsAreEqual(this.series, this.editSeries);
    },
    showButtons: function() {
      return (!this.isCreate && this.hasEdits) || this.isCreate;
    }
  },
  methods: {
    updateData: function(data) {
      this.series = { ...data };
      this.editSeries = { ...data };
    },
    onChange: function(value, name) {
      this.editSeries[name] = value;
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

      if (this.isCreate) {
        console.log('create');
      } else {
        console.log('update');
      }
    }
  }
};
</script>

<style lang="scss" src="../../styles/_page-view.scss" />
