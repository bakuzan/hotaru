<template>
  <form novalidate @submit.prevent="submit">
    <div class="page">
      <LoadingBouncer v-show="isLoading"/>
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
                :disabled="!editInstance.htrTemplate"
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
              <div :slot="viewBlockReadOnlySlot" slot-scope="{ value }">{{ value && value.name }}</div>
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
              v-if="isListType"
              id="characters"
              label="Characters"
              value="Change selection?"
              :lockEdit="isCreate"
              :forceReadOnly="readOnly"
            >
              <InputBoxAutocomplete
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
          <SeedIcon v-if="isSeeded"/>
          <HTRInstanceViewList
            v-if="isListType"
            :items="editInstance.characters"
            v-bind="editInstance.settings"
            @moved="onMove"
            @remove="onRemoveCharacter"
          />
          <HTRInstanceViewBracket
            v-else
            :bracketId="editInstance.id"
            :items="editInstance.versus"
            :options="editInstance.settings"
          />
        </div>
      </div>

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
import classNames from 'classnames';

import HTRInstanceViewList from './HTRInstanceViewList';
import HTRInstanceViewBracket from './HTRInstanceViewBracket';
import ViewBlockToggler from '@/components/ViewBlockToggler';
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import SelectBox from '@/components/SelectBox';
import LoadingBouncer from '@/components/LoadingBouncer';
import SeedIcon from '@/components/SeedIcon';

import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import { Limit, Order, Orders } from '@/constants/htr-instance-settings';
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
import { InstanceValidator } from '@/utils/validators';

function getInitialState(type) {
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
}

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
    LoadingBouncer,
    SeedIcon
  },
  props: {
    isCreate: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    const type = Routing.getParam(this.$router, 'type');
    return getInitialState(type);
  },
  metaInfo() {
    const type = Routing.getParam(this.$router, 'type');
    if (this.isCreate) {
      return { title: `Hotaru - Create ${type} Instance` };
    }

    return {
      title: this.instance && this.instance.name,
      titleTemplate: `Hotaru - View ${type} Instance - %s`
    };
  },
  watch: {
    $route: function(newRoute) {
      const { type } = newRoute.params;
      const url = Urls.build(Urls.htrInstanceCreate, { type });
      if (type && newRoute.path === url) {
        Object.assign(this.$data, getInitialState());
      }
    }
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
        const isListType =
          Routing.getParam(this.$router, 'type') === HTRTemplateTypes.list;
        return { id, withCharacters: isListType };
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

        const {
          rules: { genders, sources, series }
        } = ruleSource; // eslint-disable-line

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
      return classNames('htr-instance-content', {
        'htr-instance-content--bracket': !this.isListType,
        'htr-instance-content--wider': this.isListType,
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
    },
    isSeeded: function() {
      const { settings } = this.editInstance;
      return settings && settings.rules && settings.rules.isSeeded;
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
      const intValue = Number(value);
      this.editInstance.settings[name] = intValue;
      if (name === 'order') {
        this.editInstance.settings.customOrder =
          intValue === Orders.custom
            ? [...this.editInstance.characters.map((x) => x.id)] || []
            : null;
      }
    },
    onSearch: function(value, name) {
      this[name] = value;
    },
    onSelectTemplate: function(templateId) {
      const template = this.htrTemplates.find((x) => x.id === templateId);
      this.editInstance.htrTemplate = { ...template };
      this.editInstance.settings.rules = { ...template.rules };
      if (template.rules.limit) {
        this.editInstance.settings.limit = template.rules.limit;
      }
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

      if (this.editInstance.settings.order === Orders.custom) {
        const order = [...(this.editInstance.settings.customOrder || [])];
        this.$set(this.editInstance, 'settings', {
          ...this.editInstance.settings,
          customOrder: [...order, characterId]
        });
      }

      this.characterFilter = '';
    },
    onRemoveCharacter: function(characterId) {
      this.editInstance.characters = this.editInstance.characters.filter(
        (x) => x.id !== characterId
      );

      if (this.editInstance.settings.order === Orders.custom) {
        const order = [...(this.editInstance.settings.customOrder || [])];

        this.$set(this.editInstance, 'settings', {
          ...this.editInstance.settings,
          customOrder: [...order.filter((x) => x !== characterId)]
        });
      }
    },
    onMove: function(from, to) {
      const order = [...(this.editInstance.settings.customOrder || [])];
      order.splice(to, 0, order.splice(from, 1)[0]);

      this.$set(this.editInstance, 'settings', {
        ...this.editInstance.settings,
        customOrder: [...order]
      });
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
      if (this.isCreate && InstanceValidator.isValidNew(this.editInstance)) {
        this.handleCreate();
      } else if (
        !this.isCreate &&
        InstanceValidator.isValidExisting(this.editInstance)
      ) {
        this.handleUpdate();
      } else {
        this.readOnly = false;
      }
    },
    handleCreate: function() {
      this.mutationLoading = true;
      const instance = mapHTRInstanceToPost(this.editInstance, this.isCreate);

      this.$apollo
        .mutate({
          mutation: Mutation.createHTRInstance,
          variables: { instance, withCharacters: this.isListType },
          update: (store) => {
            store.deleteQueryHTR('htrInstance');
          }
        })
        .then(({ data }) => {
          const item = getItemFromData(data);
          this.updateData(item);
          this.readOnly = false;
          this.mutationLoading = false;

          const redirectToUrl = Urls.build(Urls.htrInstanceView, {
            id: item.id,
            type: item.htrTemplate && item.htrTemplate.type
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
          variables: { instance, withCharacters: this.isListType },
          update: (store, { data: { htrInstanceUpdate } }) => {
            const data = { ...htrInstanceUpdate };

            store.writeQuery({
              query: Query.getHTRInstanceById,
              variables: { id: data.id, withCharacters: this.isListType },
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
#characterFilter {
  margin-top: -2px;
}

.htr-instance-content {
  position: relative;
  min-height: 25px;
  overflow: hidden;
  border: 1px dashed transparent;

  &--wider {
    flex-basis: 33%;
  }
}
</style>
<style lang="scss" src="../../styles/_page-view.scss" />
