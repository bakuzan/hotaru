<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view template-creator">
      <LoadingBouncer v-show="isLoading" />

      <div class="template-creator__group">
        <h4 class="tempalte-creator__title">Details</h4>
        <InputBox
          id="name"
          :value="editTemplate.name"
          name="name"
          label="Name"
          @input="onInput"
        />
        <SelectBox
          id="type"
          :options="mappedTemplateTypes"
          :value="editTemplate.type"
          :disabled="!isCreate"
          name="type"
          text="Type"
          required
          @on-select="onInput"
        />
        <SelectBox
          id="limit"
          :options="mappedLimits"
          :value="editTemplate.rules.limit"
          name="limit"
          text="Limit"
          allow-nulls
          @on-select="onRulesInput"
        />
        <Tickbox
          v-show="isBracket"
          id="isSeeded"
          :checked="!!editTemplate.rules.isSeeded"
          class="template-creator__input"
          name="isSeeded"
          text="Is Seeded"
          @change="onRulesInput"
        />
        <div class="template-creator__available-count">
          <div>Available characters for current rules:</div>
          <div>{{ availableCharacterCount }}</div>
        </div>
      </div>
      <div class="template-creator__group">
        <h4 class="tempalte-creator__title">Rules</h4>
        <MultiSelect
          id="gender"
          :values="editTemplate.rules.genders"
          :options="mappedGenders"
          name="genders"
          label="genders"
          @update="onRulesInput"
        />
        <MultiSelect
          id="source"
          :values="editTemplate.rules.sources"
          :options="mappedSources"
          name="sources"
          label="sources"
          @update="onRulesInput"
        />
        <div>
          <InputBoxAutocomplete
            id="seriesFilter"
            :options="series"
            :filter="seriesFilter"
            name="seriesFilter"
            label="Series"
            attr="name"
            disable-local-filter
            @input="onSearchSeries"
            @on-select="onSelectSeries"
          />
          <List :items="editTemplate.rules.series" columns="one">
            <template slot-scope="slotProps">
              <SeriesCard v-bind="slotProps.item" @remove="onRemoveSeries" />
            </template>
          </List>
        </div>
      </div>

      <template v-if="showButtons">
        <portal :to="portalTarget">
          <div class="button-group">
            <Button @click="cancel">Cancel</Button>
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
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';
import SelectBox from '@/components/SelectBox';
import MultiSelect from '@/components/MultiSelect';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import List from '@/components/List';
import LoadingBouncer from '@/components/LoadingBouncer';
import { SeriesCard } from '@/components/Cards';
import Tickbox from '@/components/Tickbox';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import SourceType from '@/constants/sourceType';
import GenderType from '@/constants/genderType';
import HTRTemplateType, { HTRTemplateTypes } from '@/constants/htrTemplateType';
import { Limit } from '@/constants/htrInstanceSettings';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual, getItemFromData } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapHTRTemplateToPost
} from '@/utils/mappers';
import * as CacheUpdate from '@/utils/cache';
import { defaultHTRTemplate } from '@/utils/models';
import * as Routing from '@/utils/routing';
import { TemplateValidator } from '@/utils/validators';

function getInitialState() {
  return {
    portalTarget: Strings.portal.actions,
    mutationLoading: false,
    mappedGenders: mapEnumToSelectBoxOptions(GenderType),
    mappedSources: mapEnumToSelectBoxOptions(SourceType),
    mappedTemplateTypes: mapEnumToSelectBoxOptions(HTRTemplateType),
    template: {},
    editTemplate: defaultHTRTemplate(),
    series: [],
    seriesFilter: '',
    availableCharacterCount: 0
  };
}

export default {
  name: 'HTRTemplates',
  components: {
    InputBox,
    SelectBox,
    Tickbox,
    MultiSelect,
    InputBoxAutocomplete,
    List,
    Button,
    LoadingBouncer,
    SeriesCard
  },
  props: {
    isCreate: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return getInitialState();
  },
  metaInfo() {
    if (this.isCreate) {
      return { title: `Create Template | Hotaru` };
    }

    const type = this.template && this.template.type;
    return {
      title: this.template && this.template.name,
      titleTemplate: `View ${type} Template - %s | Hotaru`
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
        const { rules, rulesSeries, ...template } =
          data.htrTemplateById || defaultHTRTemplate();

        this.editTemplate = {
          ...template,
          rules: { ...rules, series: rulesSeries }
        };
        return { ...template, rules: { ...rules, series: rulesSeries } };
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
    },
    availableCharacterCount: {
      query: Query.getCharacterCountForTemplateRules,
      fetchPolicy: 'network-only',
      skip() {
        return this.$apollo.queries.template.loading;
      },
      variables() {
        const { genders = [], sources = [], series = [] } = this.editTemplate
          ? this.editTemplate.rules
          : this.template.rules || {};

        return {
          search: '',
          rules: {
            genders,
            sources,
            series: series.map((x) => (x instanceof Object ? x.id : x))
          }
        };
      },
      update(data) {
        return data.characterCountForTemplateRules;
      }
    }
  },
  computed: {
    hasEdits: function () {
      return !objectsAreEqual(this.template, this.editTemplate);
    },
    showButtons: function () {
      return (!this.isCreate && this.hasEdits) || this.isCreate;
    },
    isLoading: function () {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    mappedLimits: function () {
      const type = this.editTemplate.type;
      if (!type) return [];
      return mapEnumToSelectBoxOptions(Limit[type] || []);
    },
    isBracket: function () {
      return this.editTemplate.type === HTRTemplateTypes.bracket;
    }
  },
  watch: {
    $route: function (newRoute) {
      if (newRoute.path === Urls.htrTemplateCreator) {
        Object.assign(this.$data, getInitialState());
      }
    }
  },
  methods: {
    onInput: function (value, name) {
      this.editTemplate[name] = value;
    },
    onRulesInput: function (value, name) {
      this.editTemplate.rules[name] = value;
    },
    onSearchSeries: function (value) {
      this.seriesFilter = value;
    },
    onSelectSeries: function (seriesId) {
      const series = this.series.find((x) => x.id === seriesId);
      this.editTemplate.rules.series = [
        ...this.editTemplate.rules.series,
        series
      ];
      this.seriesFilter = '';
    },
    onRemoveSeries: function (seriesId) {
      this.editTemplate.rules.series = [
        ...this.editTemplate.rules.series.filter((x) => x.id !== seriesId)
      ];
    },
    cancel: function () {
      this.series = [];
      this.seriesFilter = '';
      this.editTemplate = { ...this.template };
    },
    updateData: function (data) {
      this.template = { ...data };
      this.editTemplate = { ...data };
    },
    submit: function () {
      this.mutationLoading = true;
      const template = mapHTRTemplateToPost(this.editTemplate, this.isCreate);

      if (this.isCreate && TemplateValidator.isValidNew(this.editTemplate)) {
        this.handleCreate(template);
      } else if (
        !this.isCreate &&
        TemplateValidator.isValidExisting(this.editTemplate)
      ) {
        this.handleUpdate(template);
      } else {
        this.mutationLoading = false;
      }
    },
    handleCreate: function (template) {
      this.$apollo
        .mutate({
          mutation: Mutation.createHTRTemplate,
          variables: { template },
          update: (store) => {
            store.deleteQueryHTR('htrTemplate');
          }
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
    handleUpdate: function (template) {
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
    margin: 0 {
      right: $app--margin-large;
      left: 0;
    }

    &:last-child {
      margin: {
        left: $app--margin-large;
        right: 0;
      }
    }

    & > .input-box,
    & > .select-box,
    & > .multi-select {
      flex: 0 1 35px;
      width: 100%;
    }
    & > .multi-select {
      flex: 0 1 45px;
    }
  }

  &__title {
    margin: $app--margin-standard;
  }

  &__input {
    flex: 0;
  }

  &__available-count {
    display: flex;
    flex-direction: column;
    padding: $app--padding-standard;
  }
}
</style>
<style lang="scss" src="../../styles/_page-view.scss" />
