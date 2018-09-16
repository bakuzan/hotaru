<template>
  <form novalidate @submit.prevent="submit">
    <div class="page">
      <LoadingBouncer v-show="isLoading" />
      <div :class="instanceViewClasses">
        <div class="page-view__row page-view__row--grow">
          <div class="page-view__left-column">
            <ViewBlockToggler
              id="name"
              label="Name"
              :value="editInstance.name"
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
              id="limit"
              label="Limit"
              :value="editInstance.settings.limit"
              :lockEdit="isCreate"
              :forceReadOnly="lockedReadOnlyBracket"
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
              :value="instanceOrder"
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
          <div class="page-view__content padded padded--standard">
            <ViewBlockToggler
              id="description"
              label="Description"
              :value="editInstance.description"
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
              label="Template"
              :value="editInstance.htrTemplate"
              :lockEdit="!editInstance.htrTemplate"
              :forceReadOnly="lockedReadOnly"
              @toggle="onRemoveTemplate"
            >
              <div :slot="viewBlockReadOnlySlot" slot-scope="{ value }">
                {{ value && value.name }}
              </div>
              <InputBoxAutocomplete
                id="templateFilter"
                name="templateFilter"
                label="Template"
                attr="name"
                :options="htrTemplates"
                :filter="templateFilter"
                @input="onSearch"
                @on-select="onSelectTemplate"
                disable-local-filter
              />
            </ViewBlockToggler>
            <ViewBlockToggler
              id="characters"
              label="Characters"
              value="Change selection?"
              :lockEdit="isCreate"
              :forceReadOnly="readOnly"
            >
            <InputBoxAutocomplete
              v-if="isListType"
              id="characterFilter"
              name="characterFilter"
              label="Characters"
              attr="name"
              :options="filteredCharacters"
              :filter="characterFilter"
              :disabled="disableCharacterInput"
              @input="onSearch"
              @on-select="onSelectCharacter"
              disable-local-filter
            />
            </ViewBlockToggler>
          </div>
        </div>
        <div :class="instanceContentClasses">
          <HTRInstanceViewList
            v-if="isListType"
            :items="editInstance.characters"
            :options="editInstance.settings"
            @remove="onRemoveCharacter"
          />
          <HTRInstanceViewBracket
            v-else
          />
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
import classNames from 'classnames';

import HTRInstanceViewList from './HTRInstanceViewList';
import HTRInstanceViewBracket from './HTRInstanceViewBracket';
import ViewBlockToggler from '@/components/ViewBlockToggler';
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import SelectBox from '@/components/SelectBox';
import LoadingBouncer from '@/components/LoadingBouncer';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import { Limit, Order } from '@/constants/htr-instance-settings';
import { HTRTemplateTypes } from '@/constants/htr-template-type';
import { Query, Mutation } from '@/graphql';
import { objectsAreEqual, getItemFromData } from '@/utils';
import {
  mapEnumToSelectBoxOptions,
  mapToSelectBoxOptions,
  mapHTRInstanceToPost,
  mapHTRInstanceToOptimisticUpdate,
  mapHTRInstanceToStore
} from '@/utils/mappers';
import * as CacheUpdate from '@/utils/cache';
import { defaultInstanceModel } from '@/utils/models';
import * as Routing from '@/utils/routing';

export default {
  name: 'HTRInstanceView',
  components: {
    HTRInstanceViewList,
    HTRInstanceViewBracket,
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
    const type = Routing.getParam(this.$router, 'type');

    return {
      viewBlockReadOnlySlot: Strings.slot.viewBlock,
      portalTarget: Strings.portal.actions,
      mutationLoading: false,
      readOnly: false,
      instance: { settings: {} },
      editInstance: defaultInstanceModel(type),
      htrTemplates: [],
      templateFilter: '',
      characters: [],
      characterFilter: '',
      mappedOrders: mapToSelectBoxOptions(Order)
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
          ...instance,
          settings: { ...instance.settings }
        };
        return { ...instance, settings: { ...instance.settings } };
      }
    },
    htrTemplates: {
      query: Query.getHTRTemplatesByTypeForAutocomplete,
      skip() {
        return !this.templateFilter;
      },
      debounce: 1000,
      variables() {
        return { search: this.templateFilter, type: this.type };
      }
    },
    characters: {
      query: Query.getCharactersForTemplateRules,
      skip() {
        return !this.characterFilter;
      },
      debounce: 1000,
      variables() {
        const ruleSource = this.isCreate
          ? this.editInstance.htrTemplate
          : this.editInstance.settings;

        const { rules: { genders, sources, series } } = ruleSource; // eslint-disable-line

        return {
          search: this.characterFilter,
          rules: { genders, sources, series }
        };
      },
      update(data) {
        return data.charactersForTemplateRules;
      }
    }
  },
  computed: {
    type: function() {
      return (
        Routing.getParam(this.$router, 'type') ||
        (this.editInstance.htrTemplate && this.editInstance.htrTemplate.type)
      );
    },
    isListType: function() {
      return this.type === HTRTemplateTypes.list;
    },
    instanceViewClasses: function() {
      return classNames('page-view', {
        'page-view--column': !this.isListType
      });
    },
    instanceContentClasses: function() {
      return classNames({
        'page-view__left-column': this.isListType,
        'page-view__content': !this.isListType
      });
    },
    mappedLimits: function() {
      return mapEnumToSelectBoxOptions(Limit[this.type] || []);
    },
    hasEdits: function() {
      return (
        !objectsAreEqual(this.instance, this.editInstance) ||
        !objectsAreEqual(this.instance.settings, this.editInstance.settings)
      );
    },
    showButtons: function() {
      return (!this.isCreate && this.hasEdits) || this.isCreate;
    },
    isLoading: function() {
      return CacheUpdate.isLoading(this.$apollo) || this.mutationLoading;
    },
    lockedReadOnly: function() {
      return !this.isCreate || this.readOnly;
    },
    lockedReadOnlyBracket: function() {
      return (!this.isCreate && !this.isListType) || this.readOnly;
    },
    filteredCharacters: function() {
      return this.characters.filter(
        (x) =>
          !this.editInstance.characters ||
          this.editInstance.characters.every((y) => y.id !== x.id)
      );
    },
    disableCharacterInput: function() {
      const { characters = [], settings } = this.editInstance;
      return (
        !this.editInstance.htrTemplate ||
        !characters ||
        characters.length >= settings.limit
      );
    },
    instanceOrder: function() {
      const order =
        Order.find((x) => x.id === this.editInstance.settings.order) || {};
      return order.name;
    }
  },
  methods: {
    updateData: function(data) {
      this.instance = { ...data };
      this.editInstance = { ...data };
    },
    onInput: function(value, name) {
      this.editInstance[name] = value;
    },
    onSettingsInput: function(value, name) {
      this.editInstance.settings[name] = Number(value);
    },
    onSearch: function(value, name) {
      this[name] = value;
    },
    onSelectTemplate: function(templateId) {
      const template = this.htrTemplates.find((x) => x.id === templateId);
      this.editInstance.htrTemplate = { ...template };
      this.templateFilter = '';
    },
    onRemoveTemplate: function() {
      this.editInstance.htrTemplate = null;
      this.editInstance.characters = [];
      this.characterFilter = '';
      this.characters = [];
    },
    onSelectCharacter: function(characterId) {
      const character = this.characters.find((x) => x.id === characterId);
      this.editInstance.characters = [
        ...this.editInstance.characters,
        { ...character }
      ];
      this.characterFilter = '';
    },
    onRemoveCharacter: function(characterId) {
      this.editInstance.characters = this.editInstance.characters.filter(
        (x) => x.id !== characterId
      );
    },
    cancel: function() {
      this.readOnly = true;
      this.htrTemplates = [];
      this.templateFilter = '';
      this.editInstance = { ...this.instance };
      this.$nextTick(function() {
        this.readOnly = false;
      });
    },
    submit: function() {
      this.readOnly = true; // set back to read only.
      console.log('submitted!');
      if (this.isCreate) {
        this.handleCreate();
      } else {
        this.handleUpdate();
      }
    },
    handleCreate: function() {
      this.mutationLoading = true;
      const instance = mapHTRInstanceToPost(this.editInstance, this.isCreate);

      this.$apollo
        .mutate({
          mutation: Mutation.createHTRInstance,
          variables: { instance }
        })
        .then(({ data }) => {
          const item = getItemFromData(data);
          this.updateData(item);
          this.mutationLoading = false;

          const redirectToUrl = Urls.build(Urls.htrInstanceView, {
            id: item.id
          });
          this.$router.push(redirectToUrl);
        });
    },
    handleUpdate: function() {
      this.mutationLoading = true;
      const instance = mapHTRInstanceToPost(this.editInstance, this.isCreate);

      this.$apollo
        .mutate({
          mutation: Mutation.updateHTRInstance,
          variables: { instance },
          update: (store, { data: { htrInstanceUpdate } }) => {
            const data = { ...htrInstanceUpdate };

            store.writeQuery({
              query: Query.getHTRInstanceById,
              variables: { id: data.id },
              data: { htrInstanceById: mapHTRInstanceToStore(data) }
            });
          },
          optimisticResponse: mapHTRInstanceToOptimisticUpdate(
            this.editInstance
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

<style lang="scss" scoped>
@import '../../styles/_variables';

#characterFilter {
  margin-top: -2px;
}
</style>
<style lang="scss" src="../../styles/_page-view.scss" />
