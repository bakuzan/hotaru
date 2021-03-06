<template>
  <div class="page page-view versus-comparison">
    <div class="versus-comparison__actions">
      <InputBoxAutocomplete
        id="characterFilter"
        :options="characterSearchResults"
        :filter="characterFilter"
        name="characterFilter"
        label="search characters"
        attr="name"
        disable-local-filter
        @input="onSearchCharacters"
        @on-select="onSelectCharacter"
      />
      <Button
        :disabled="!hasTwoCharacters"
        theme="primary"
        @click="onTriggerQuery"
        >Compare</Button
      >
    </div>
    <div class="versus-comparison__content">
      <div
        v-for="c in activeCharacters"
        :key="c.id"
        class="versus-comparison__item"
      >
        <Button
          v-show="c.isActive"
          :icon="removeIcon"
          class="versus-comparison__remove"
          @click="handleRemoveCharacter(c.id)"
        />
        <ListFigureCard
          v-bind="c"
          :url-source="cardUrl"
          class="comparison-card"
          figure-class="comparison-card__figure"
        />
      </div>
      <div class="comparison-summary">
        <div class="comparison-summary__text">{{ comparisonSummaryTotal }}</div>
        <div class="comparison-summary__text">
          {{ comparisonSummaryWinSplit }}
        </div>
      </div>
      <Tabs>
        <Tab name="HeadToHead">
          <List
            :items="versusHistoryComparison.headToHead"
            class="comparison-list"
            columns="one"
          >
            <template slot-scope="slotProps">
              <VoteButton
                :has-winner="!!slotProps.item.winnerId"
                :is-winner="isWinner(slotProps.item, 0)"
                class="versus-comparison__button"
              />
              <div class="versus-comparison__text">
                <div>{{ formatDate(slotProps.item.updatedAt) }}</div>
                <div>{{ slotProps.item.type }}</div>
              </div>
              <VoteButton
                :has-winner="!!slotProps.item.winnerId"
                :is-winner="isWinner(slotProps.item, 1)"
                class="versus-comparison__button"
              />
            </template>
          </List>
        </Tab>
        <Tab name="OpponentsInCommon">
          <List
            :items="opponentsInCommon"
            class="comparison-list"
            columns="one"
          >
            <template slot-scope="slotProps">
              <VersusSharedOpponentCard v-bind="slotProps.item" />
            </template>
          </List>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script>
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import { ListFigureCard, VersusSharedOpponentCard } from '@/components/Cards';
import { Button, VoteButton } from '@/components/Buttons';
import List from '@/components/List';
import HTRTabs from '@/components/Tabs';

import Icons from '@/constants/icons';
import Urls from '@/constants/urls';
import Strings from '@/constants/strings';
import { Query } from '@/graphql';
import { createDummyCharacterCompare } from '@/utils/models';
import { formatDateTimeForDisplay } from '@/utils/date';
import { groupBy } from '@/utils';

function getTotalAndWins(versus, id) {
  const filtered = versus.filter((x) => x.keyCharacterId === id);
  const filteredWins = filtered.filter((x) => x.winnerId === id);
  return {
    total: filtered.length,
    wins: filteredWins.length
  };
}

export default {
  name: 'VersusComparison',
  components: {
    InputBoxAutocomplete,
    ListFigureCard,
    VersusSharedOpponentCard,
    Button,
    VoteButton,
    List,
    Tabs: HTRTabs.Tabs,
    Tab: HTRTabs.Tab
  },
  data: function () {
    return {
      removeIcon: Icons.cross,
      cardUrl: Urls.characterView,
      characterFilter: '',
      characters: [],
      placeholders: [
        createDummyCharacterCompare(),
        createDummyCharacterCompare()
      ],
      compareCharacters: [],
      versusHistoryComparison: {},
      comparisonSummary: null
    };
  },
  metaInfo: {
    title: 'Versus Comparison | Hotaru'
  },
  apollo: {
    characters: {
      query: Query.getCharactersForVersusCompare,
      debounce: 1000,
      skip() {
        return !this.characterFilter;
      },
      variables() {
        return { search: this.characterFilter };
      }
    }
  },
  computed: {
    characterSearchResults: function () {
      const characters = this.characters || [];
      return characters.filter((x) => !this.characterIds.includes(x.id));
    },
    characterIds: function () {
      const { characterIds } = this.$route.query;
      const str = characterIds || ',';
      return str.split(',').map((x) => (x ? Number(x) : null));
    },
    activeCharacters: function () {
      return this.characterIds.map((id, i) => {
        const c = this.compareCharacters.find((c) => c.id === id);
        if (!id || !c) return this.placeholders[i];
        return { ...c, isActive: true };
      });
    },
    hasTwoCharacters: function () {
      return (
        this.characterIds.every((x) => !!x) && this.characterIds.length === 2
      );
    },
    comparisonSummaryTotal: function () {
      if (!this.comparisonSummary) return;
      const value = this.comparisonSummary.total;
      return value === 1 ? `${value} match` : `${value} matches`;
    },
    comparisonSummaryWinSplit: function () {
      if (!this.comparisonSummary) return;
      const { leftWinner, rightWinner } = this.comparisonSummary;
      return `${leftWinner} - ${rightWinner}`;
    },
    opponentsInCommon: function () {
      const [c1, c2] = this.characterIds;
      const { sharedOpponents = [] } = this.versusHistoryComparison;
      const groups = groupBy(sharedOpponents, 'characterId');

      return Object.keys(groups).map((k) => {
        const versus = groups[k];
        const first = versus[0];
        const left = getTotalAndWins(versus, c1);
        const right = getTotalAndWins(versus, c2);

        return {
          opponent: {
            id: first.characterId,
            name: first.name,
            displayImage: first.displayImage
          },
          left,
          right
        };
      });
    }
  },
  created() {
    if (
      this.characterIds.every((x) => x === null) ||
      this.characterIds.every(
        (x) => !x || this.compareCharacters.some((c) => c.id === x)
      )
    )
      return;

    this.$apollo
      .query({
        query: Query.getCharactersByIds,
        variables: { characterIds: this.characterIds }
      })
      .then(({ data, loading }) => {
        if (!loading) {
          this.compareCharacters.push(...data.charactersByIds);
        }
      });
  },
  methods: {
    formatDate: function (date) {
      return formatDateTimeForDisplay(date);
    },
    onSearchCharacters: function (value) {
      this.characterFilter = value;
    },
    onSelectCharacter: function (characterId) {
      const character = this.characters.find((x) => x.id === characterId);
      this.compareCharacters.push(character);

      const index = this.characterIds.findIndex((x) => x === null);
      const newQueryParam = [...this.characterIds]
        .map((x, i) => (i === index ? characterId : x || ''))
        .join(',');

      this.updateRoute(newQueryParam);
      this.characterFilter = '';
    },
    onTriggerQuery: function () {
      this.$apollo
        .query({
          query: Query.getVersusHistoryComparison,
          variables: { characterIds: this.characterIds }
        })
        .then(({ data, loading }) => {
          if (!loading) {
            const { versusHistoryComparison } = data;
            const [c1, c2] = this.characterIds;

            const { headToHead } = versusHistoryComparison;
            this.versusHistoryComparison = versusHistoryComparison;
            this.comparisonSummary = {
              total: headToHead.length,
              leftWinner: headToHead.filter((x) => x.winnerId === c1).length,
              rightWinner: headToHead.filter((x) => x.winnerId === c2).length
            };
          }
        });
    },
    handleRemoveCharacter: function (characterId) {
      const newQueryParam = [...this.characterIds]
        .map((x) => (x === characterId ? '' : x || ''))
        .join(',');

      this.updateRoute(newQueryParam);
      this.compareCharacters = this.compareCharacters.filter(
        (x) => x.id !== characterId
      );
      this.versusHistoryComparison = [];
      this.comparisonSummary = null;
    },
    updateRoute: function (characterIds) {
      this.$router.replace({
        name: Strings.route.versusComparison,
        query: { characterIds }
      });
    },
    isWinner: function (item, index) {
      return item.winnerId === this.characterIds[index];
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

.versus-comparison {
  flex-direction: column;
  &__actions {
    display: flex;
  }
  &__content {
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    position: relative;
    display: flex;
    width: 50%;
  }
  &__remove {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__button,
  &__text {
    display: flex;
    flex: 1;
  }
  &__text {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.comparison-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding-top: #{$app--padding-standard * 2};

  &__text {
    margin: $app--margin-small 0;
  }
}

.comparison-list {
  display: flex;
  width: 100%;
}
</style>
<style lang="scss">
.comparison-card {
  margin: 0 auto;

  &__figure > img {
    height: auto !important;
  }
}
</style>

<style lang="scss" src="../../styles/_page-view.scss" />
