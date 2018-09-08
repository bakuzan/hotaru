<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view versus-creator">
      <div class="versus-creator__rules">
        <div class="versus-creator__group">
          <MultiSelect 
            id="gender"
            name="genders"
            label="genders"
            :values="rules.genders"
            :options="mappedGenders"
            @update="onInput"
          />
          <Tickbox
            name="isIncludeOnlyGender"
            :text="includeExcludeText(rules.isIncludeOnlyGender)"
            :checked="rules.isIncludeOnlyGender"
            @change="onInput"
          />
        </div>
        <div class="versus-creator__group">
          <MultiSelect 
            id="source"
            name="sources"
            label="sources"
            :values="rules.sources"
            :options="mappedSources"
            @update="onInput"
          />
          <Tickbox
            name="isIncludeOnlySource"
            :text="includeExcludeText(rules.isIncludeOnlySource)"
            :checked="rules.isIncludeOnlySource"
            @change="onInput"
          />
        </div>
        <div class="versus-creator__group">
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
            <Tickbox
              name="isIncludeOnlySeries"
              :text="includeExcludeText(rules.isIncludeOnlySeries)"
              :checked="rules.isIncludeOnlySeries"
              @change="onInput"
            />
          </div>
          <List
            columns="one"
            :items="rules.series"
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

      <div>
        <LoadingBouncer v-show="mutationLoading" />
        <VersusWidget
          v-if="versus"
          v-bind="versus"
          @vote="handleVote"
        />
      </div>

      <template v-if="showButtons">
        <portal :to="portalTarget">
          <div class="button-group">
            <Button
              theme="secondary"
              @click="submit"
            >
              Create
            </Button>
          </div>
        </portal>
      </template>
    </div>
  </form>
</template>

<script>
import { Button } from '@/components/Buttons';
import MultiSelect from '@/components/MultiSelect';
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import List from '@/components/List';
import Tickbox from '@/components/Tickbox';
import LoadingBouncer from '@/components/LoadingBouncer';

import Strings from '@/constants/strings';
import Icons from '@/constants/icons';
import GenderType from '@/constants/gender-type';
import SourceType from '@/constants/source-type';
import { Query, Mutation } from '@/graphql';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';

export default {
  name: 'VersusCreator',
  components: {
    MultiSelect,
    InputBoxAutocomplete,
    Tickbox,
    List,
    Button,
    LoadingBouncer
  },
  data: function() {
    return {
      mutationLoading: false,
      removeIcon: Icons.cross,
      portalTarget: Strings.portal.actions,
      seriesFilter: '',
      series: [],
      versus: null,
      rules: {
        genders: [],
        series: [],
        sources: [],
        isIncludeOnlyGender: false,
        isIncludeOnlySeries: false,
        isIncludeOnlySource: false
      }
    };
  },
  apollo: {
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
    showButtons: function() {
      return true;
    },
    mappedGenders: function() {
      return mapEnumToSelectBoxOptions(GenderType);
    },
    mappedSources: function() {
      return mapEnumToSelectBoxOptions(SourceType);
    }
  },
  methods: {
    includeExcludeText: function(value) {
      return value ? 'include' : 'exclude';
    },
    onInput: function(value, name) {
      this.rules[name] = value;
    },
    onSearchSeries: function(value) {
      this.seriesFilter = value;
    },
    onSelectSeries: function(seriesId) {
      const series = this.series.find((x) => x.id === seriesId);
      this.rules.series = [...this.rules.series, series];
      this.seriesFilter = '';
    },
    onRemoveSeries: function(seriesId) {
      this.rules.series = [
        ...this.rules.series.filter((x) => x.id !== seriesId)
      ];
    },
    submit: function() {
      this.mutationLoading = true;
      const { series, ...passing } = this.rules;
      const rules = { ...passing, series: series.map((x) => x.id) };
      console.log('submit!', rules);
      this.$apollo
        .mutate({
          mutation: Mutation.createVersusFromRules,
          variables: { rules }
        })
        .then((data) => {
          this.mutationLoading = false;
          this.versus = data.versusFromRules;
        });
    },
    handleVote: function(versusId, winnerId) {
      this.mutationLoading = true;

      this.$apollo
        .mutate({
          mutation: Mutation.castVote,
          variables: { versusId, winnerId }
        })
        .then(() => {
          this.versus = null;
          this.mutationLoading = false;
        })
        .catch((error) => {
          console.log('failed to create', error);
          this.mutationLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.versus-creator {
  &__rules {
    display: flex;
    flex: 1;
  }
  &__group {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}

.series-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>

<style lang="scss" src="../../styles/_page-view.scss" />
