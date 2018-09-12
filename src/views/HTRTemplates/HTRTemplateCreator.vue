<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view template-creator">
      <LoadingBouncer v-show="isLoading" />

      <div class="template-creator__group">
          <h4 class="padded--standard">Template details</h4>
        <InputBox
            id="name"
            name="name"
            label="Name"
            :value="editTemplate.name"
            @input="onInput"
        />
        <SelectBox
            id="source"
            name="source"
            text="Source"
            :options="mappedSources"
            :value="editTemplate.source"
            @on-select="onInput"
            required
        />
      </div>
        <div class="template-creator__group">
            <h4 class="padded--standard">Template rules</h4>
            <MultiSelect 
            id="gender"
            name="genders"
            label="genders"
            :values="editTemplate.rules.genders"
            :options="mappedGenders"
            @update="onRulesInput"
            />
            <MultiSelect 
            id="source"
            name="sources"
            label="sources"
            :values="editTemplate.rules.sources"
            :options="mappedSources"
            @update="onRulesInput"
            />
            <div>
            <InputBoxAutocomplete
                id="seriesFilter"
                name="seriesFilter"
                text="Series"
                attr="name"
                :options="series"
                :filter="seriesFilter"
                @input="onSearchSeries"
                @on-select="onSelectSeries"
                disable-local-filter
            />
            <List
                columns="one"
                :items="editTemplate.rules.series"
            >
                <template slot-scope="slotProps">
                <div class="series-item">
                    {{slotProps.item.name}}
                    <Button
                    className="series-item__remove"
                    size="small"
                    :icon="removeIcon"
                    @click="onRemoveSeries(slotProps.item.id)"
                    />
                </div>
                </template>
            </List>
            </div>
        </div>

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
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';
import SelectBox from '@/components/SelectBox';
import MultiSelect from '@/components/MultiSelect';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import SourceType from '@/constants/source-type';
import GenderType from '@/constants/gender-type';
import HTRTemplateType from '@/constants/htr-template-type';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual, getItemFromData } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapHTRTemplateToPost
} from '@/utils/mappers';
import * as CacheUpdate from '@/utils/cache';
import { defaultHTRTemplate } from '@/utils/models';
import * as Routing from '@/utils/routing';

export default {
  name: 'HTRTemplates',
  components: {
    InputBox,
    SelectBox,
    MultiSelect,
    InputBoxAutocomplete,
    List,
    Button,
    LoadingBouncer
  },
  props: {
    isCreate: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      portalTarget: Strings.portal.actions,
      mutationLoading: false,
      template: {},
      editTemplate: defaultHTRTemplate(),
      series: [],
      seriesFilter: ''
    };
  },
  apollo: {
    template: {
      query: Query.getHTRTemplateById,
      fetchPolicy: 'network-only',
      skip() {
        return this.isCreate;
      },
      variables() {
        const id = Number(Routing.getParam(this.$router, 'id'));
        return { id };
      },
      update(data) {
        const template = data.htrTemplateById || defaultHTRTemplate();
        this.editTemplate = { ...template };
        return { ...template };
      }
    },
    series: {
      query: Query.getSeries,
      debounce: 1000,
      skip() {
        return !this.seriesFilter;
      },
      variables() {
        return { search: this.seriesFilter };
      }
    }
  },
  computed: {
    hasEdits: function() {
      return !objectsAreEqual(this.template, this.editTemplate);
    },
    showButtons: function() {
      return (!this.isCreate && this.hasEdits) || this.isCreate;
    },
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    mappedGenders: function() {
      return mapEnumToSelectBoxOptions(GenderType);
    },
    mappedSources: function() {
      return mapEnumToSelectBoxOptions(SourceType);
    },
    mappedTemplateTypes: function() {
      return mapEnumToSelectBoxOptions(HTRTemplateType);
    }
  },
  methods: {
    onInput: function(value, name) {
      this.editTemplate[name] = value;
    },
    onRulesInput: function(value, name) {
      this.editTemplate.rules[name] = value;
    },
    onSearchSeries: function(value) {
      this.seriesFilter = value;
    },
    onSelectSeries: function(seriesId) {
      const series = this.series.find((x) => x.id === seriesId);
      this.editTemplate.rules.series = [
        ...this.editTemplate.rules.series,
        series
      ];
      this.seriesFilter = '';
    },
    onRemoveSeries: function(seriesId) {
      this.editTemplate.rules.series = [
        ...this.editTemplate.rules.series.filter((x) => x.id !== seriesId)
      ];
    },
    cancel: function() {
      this.series = [];
      this.seriesFilter = '';
      this.editTemplate = { ...this.template };
    },
    submit: function() {
      this.mutationLoading = true;
      const template = mapHTRTemplateToPost(this.editTemplate, this.isCreate);

      if (this.isCreate) {
        this.handleCreate(template);
      } else {
        this.handleUpdate(template);
      }
    },
    handleCreate: function(template) {
      this.$apollo
        .mutate({
          mutation: Mutation.createHTRTemplate,
          variables: { template }
        })
        .then(({ data }) => {
          const item = getItemFromData(data);
          this.updateData(item);
          this.mutationLoading = false;

          const redirectToUrl = Urls.build(Urls.htrTemplateEditor, {
            id: item.id
          });
          this.$router.push(redirectToUrl);
        });
    },
    handleUpdate: function(template) {
      this.$apollo
        .mutate({
          mutation: Mutation.updateHTRTemplate,
          variables: { template }
        })
        .then(() => {
          this.mutationLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.template-creator {
  &__group {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 0 $app--margin-large;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
<style lang="scss" src="../../styles/_page-view.scss" />