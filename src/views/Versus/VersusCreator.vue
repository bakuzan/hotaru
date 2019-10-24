<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view versus-creator">
      <div class="versus-creator__rules">
        <div class="versus-creator__group">
          <MultiSelect
            id="gender"
            :values="rules.genders"
            :options="mappedGenders"
            :disabled="rules.hasNoVersusOnly"
            name="genders"
            label="genders"
            @update="onInput"
          />
          <TickboxOnOff
            id="isIncludeOnlyGender"
            :text="onOffTextOptions"
            :checked="rules.isIncludeOnlyGender"
            :disabled="rules.hasNoVersusOnly"
            name="isIncludeOnlyGender"
            align-left
            @change="onInput"
          />
        </div>
        <div class="versus-creator__group">
          <MultiSelect
            id="source"
            :values="rules.sources"
            :options="mappedSources"
            :disabled="rules.hasNoVersusOnly"
            name="sources"
            label="sources"
            @update="onInput"
          />
          <TickboxOnOff
            id="isIncludeOnlySource"
            :text="onOffTextOptions"
            :checked="rules.isIncludeOnlySource"
            :disabled="rules.hasNoVersusOnly"
            name="isIncludeOnlySource"
            align-left
            @change="onInput"
          />
        </div>
        <div class="versus-creator__group">
          <div>
            <InputBoxAutocomplete
              id="seriesFilter"
              :options="series"
              :filter="seriesFilter"
              :disabled="rules.hasNoVersusOnly"
              name="seriesFilter"
              label="Series"
              attr="name"
              disable-local-filter
              @input="onSearchSeries"
              @on-select="onSelectSeries"
            />
            <TickboxOnOff
              id="isIncludeOnlySeries"
              :text="onOffTextOptions"
              :checked="rules.isIncludeOnlySeries"
              :disabled="rules.hasNoVersusOnly"
              name="isIncludeOnlySeries"
              align-left
              @change="onInput"
            />
          </div>
          <List :items="rules.series" columns="one">
            <template slot-scope="slotProps">
              <SeriesCard v-bind="slotProps.item" @remove="onRemoveSeries" />
            </template>
          </List>
        </div>
        <div class="versus-creator__group versus-creator__group--adjusted">
          <div class="versus-creator__label">No Versus Only</div>
          <TickboxOnOff
            id="hasNoVersusOnly"
            :checked="rules.hasNoVersusOnly"
            name="hasNoVersusOnly"
            align-left
            @change="onInput"
          />
        </div>
      </div>

      <div>
        <LoadingBouncer v-show="mutationLoading" />
        <VersusWidget v-if="versus" v-bind="versus" @vote="handleVote" />
      </div>

      <template v-if="showButtons">
        <portal :to="portalTarget">
          <div class="button-group">
            <Button theme="secondary" @click="submit">Create</Button>
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
import TickboxOnOff from '@/components/TickboxOnOff';
import LoadingBouncer from '@/components/LoadingBouncer';
import VersusWidget from '@/components/Widgets/VersusWidget';
import { SeriesCard } from '@/components/Cards';

import Strings from '@/constants/strings';
import Icons from '@/constants/icons';
import GenderType from '@/constants/genderType';
import SourceType from '@/constants/sourceType';
import { Query, Mutation } from '@/graphql';
import { mapEnumToSelectBoxOptions } from '@/utils/mappers';
import { versusCreatorDefaultRules } from '@/utils/models';
import alertService from '@/utils/alertService';

export default {
  name: 'VersusCreator',
  components: {
    MultiSelect,
    InputBoxAutocomplete,
    TickboxOnOff,
    List,
    Button,
    LoadingBouncer,
    VersusWidget,
    SeriesCard
  },
  data: function() {
    return {
      mutationLoading: false,
      removeIcon: Icons.cross,
      portalTarget: Strings.portal.actions,
      onOffTextOptions: {
        on: 'Include',
        off: 'Exclude'
      },
      seriesFilter: '',
      series: [],
      versus: null,
      rules: versusCreatorDefaultRules(),
      mappedGenders: mapEnumToSelectBoxOptions(GenderType),
      mappedSources: mapEnumToSelectBoxOptions(SourceType)
    };
  },
  metaInfo: {
    title: 'Versus Creator | Hotaru'
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
      return !this.versus || this.versus.winnerId;
    }
  },
  created() {
    this.$apollo
      .query({
        query: Query.getVersusSingles,
        fetchPolicy: 'network-only'
      })
      .then(({ data }) => {
        const { versusSinglesNotWon } = data;
        if (!versusSinglesNotWon || !versusSinglesNotWon.length) return null;

        const [singleVersus] = versusSinglesNotWon;
        this.versus = singleVersus;
      });
  },
  methods: {
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
      this.versus = null;
      this.mutationLoading = true;
      const { series, genders, sources, ...passing } = this.rules;
      const rules = {
        ...passing,
        genders: [...genders],
        sources: [...sources],
        series: series.map((x) => x.id)
      };

      this.$apollo
        .mutate({
          mutation: Mutation.createVersusFromRules,
          variables: { rules }
        })
        .then(({ data }) => {
          const { versusFromRules } = data;

          this.mutationLoading = false;
          this.versus = versusFromRules ? versusFromRules : null;
        })
        .catch((error) => {
          alertService.sendError({
            message: 'Failed to Create',
            detail: error.message || error
          });
          this.mutationLoading = false;
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
          this.mutationLoading = false;
          this.versus = { ...this.versus, winnerId };
          this.rules = versusCreatorDefaultRules();
        })
        .catch((error) => {
          alertService.sendError({
            message: 'Failed to Vote',
            detail: error.message || error
          });
          this.mutationLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.versus-creator {
  flex-direction: column;

  &__rules {
    display: flex;
    flex: 1;
  }
  &__group {
    display: flex;
    flex-direction: column;
    flex: 1;

    &--adjusted {
      justify-content: space-evenly;
      margin-left: $app--margin-standard;
    }
  }
  &__label {
    padding: 0 $app--padding-standard;
    opacity: 0.5;
  }
}
</style>

<style lang="scss" src="../../styles/_page-view.scss" />
