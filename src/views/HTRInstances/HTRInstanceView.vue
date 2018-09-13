<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view">
      <LoadingBouncer v-show="isLoading" />
      <div class="page-view__content view-info">
        <ViewBlockToggler
          id="name"
          label="Name"
          :value="instance.name"
          :lockEdit="isCreate"
          :forceReadOnly="readOnly"
        >
          <InputBox
            id="name"
            name="name"
            label="Name"
            :value="editInstance.name"
            @input="onInput"
          />
        </ViewBlockToggler>
        <ViewBlockToggler
          id="description"
          label="Description"
          :value="instance.description"
          :lockEdit="isCreate"
          :forceReadOnly="readOnly"
        >
          <InputBox
            id="description"
            name="description"
            label="Description"
            :value="editInstance.description"
            @input="onInput"
          />
        </ViewBlockToggler>
        <ViewBlockToggler
          id="htrTemplate"
          :value="editInstance.htrTemplate"
          blockClass="template-view-block"
          :lockEdit="isCreate"
          :forceReadOnly="readOnly"
        >
          <div :slot="viewBlockReadOnlySlot" slot-scope="{ value }">
            {{ value && value.name || 'Template' }}
          </div>
          <InputBoxAutocomplete
            id="templateFilter"
            name="templateFilter"
            text="Templates"
            attr="name"
            :options="htrTemplates"
            :filter="templateFilter"
            @input="onSearchTemplates"
            @on-select="onSelectTemplate"
            disable-local-filter
          />
        </ViewBlockToggler>
        <ViewBlockToggler
          id="limit"
          label="Limit"
          :value="instance.limit"
          :lockEdit="isCreate"
          :forceReadOnly="readOnly"
        >
          <SelectBox
            id="limit"
            name="limit"
            text="Limit"
            :options="mappedLimits"
            :value="editInstance.settings.limit"
            @on-select="onSettingsInput"
            required
          />
        </ViewBlockToggler>
        <ViewBlockToggler
          v-if="isListType"
          id="order"
          label="Order"
          :value="instance.order"
          :lockEdit="isCreate"
          :forceReadOnly="readOnly"
        >
          <SelectBox
            id="order"
            name="order"
            text="Order"
            :options="mappedOrders"
            :value="editInstance.settings.order"
            @on-select="onSettingsInput"
            required
          />
        </ViewBlockToggler>
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
import ViewBlockToggler from '@/components/ViewBlockToggler';
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import SelectBox from '@/components/SelectBox';
import LoadingBouncer from '@/components/LoadingBouncer';

import Strings from '@/constants/strings';
import { Limit, Order } from '@/constants/htr-instance-settings';
import { HTRTemplateTypes } from '@/constants/htr-template-type';
import { Query } from '@/graphql';
import { objectsAreEqual } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapToSelectBoxOptions
} from '@/utils/mappers';
import * as CacheUpdate from '@/utils/cache';
import { defaultInstanceModel } from '@/utils/models';
import * as Routing from '@/utils/routing';

export default {
  name: 'HTRInstanceView',
  components: {
    ViewBlockToggler,
    Button,
    InputBox,
    InputBoxAutocomplete,
    SelectBox,
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
      viewBlockReadOnlySlot: Strings.slot.viewBlock,
      portalTarget: Strings.portal.actions,
      mutationLoading: false,
      readOnly: false,
      instance: {},
      editInstance: defaultInstanceModel(),
      htrTemplates: [],
      templateFilter: ''
    };
  },
  apollo: {
    instance: {
      query: Query.getHTRInstanceById,
      fetchPolicy: 'network-only',
      skip() {
        return this.isCreate;
      },
      variables() {
        const id = Number(Routing.getParam(this.$router, 'id'));
        return { id };
      },
      update(data) {
        const instance = data.htrInstanceById || defaultInstanceModel();
        this.editInstance = {
          ...instance
        };
        return { ...instance };
      }
    },
    htrTemplates: {
      query: Query.getHTRTemplatesByType,
      skip() {
        return !this.templateFilter;
      },
      debounce: 1000,
      variables() {
        return { search: this.templateFilter, type: this.type };
      }
    }
  },
  computed: {
    type: function() {
      return Routing.getParam(this.$router, 'type');
    },
    isListType: function() {
      return this.type === HTRTemplateTypes.list;
    },
    hasEdits: function() {
      return !objectsAreEqual(this.instance, this.editInstance);
    },
    showButtons: function() {
      return (!this.isCreate && this.hasEdits) || this.isCreate;
    },
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    mappedLimits: function() {
      return mapEnumToSelectBoxOptions(Limit[this.type]);
    },
    mappedOrders: function() {
      return mapToSelectBoxOptions(Order);
    }
  },
  methods: {
    onInput: function(value, name) {
      this.editInstance[name] = value;
    },
    onSettingsInput: function(value, name) {
      this.editInstance.settings[name] = value;
    },
    onSearchTemplates: function(value) {
      this.templateFilter = value;
    },
    onSelectTemplate: function(templateId) {
      const template = this.htrTemplates.find((x) => x.id === templateId);
      this.editTemplate.htrTemplate = { ...template };
      this.templateFilter = '';
    },
    onRemoveTemplate: function() {
      this.editInstance.htrTemplate = null;
    },
    cancel: function() {},
    submit: function() {}
  }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss" src="../../styles/_page-view.scss" />
