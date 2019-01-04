<template>
  <div>
    <DropdownMenu
      ignore-position
      :id="id"
      class="app-settings"
      :portal-target="target"
      :align="alignment"
      :title="title"
      :icon="icon"
    >
      <li class="app-settings__item">
        <SelectBox
          id="appTheme"
          name="appTheme"
          text="App Theme"
          :options="appThemes"
          :value="theme"
          @on-select="onChange"
        />
      </li>
      <li class="app-settings__item">
        <ButtonWithFeedback
          theme="primary"
          :update-state="getFeedbackUpdater"
          @click="updateRankings"
        >Update Rankings</ButtonWithFeedback>
      </li>
    </DropdownMenu>
    <portal :to="backPortalTarget">
      <Button
        v-show="routeHistory.length > 0"
        class="app__back"
        title="Go Back"
        size="small"
        @click="goBack"
      >
        <img :src="backIcon" alt="back arrow">
      </Button>
    </portal>
  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu';
import SelectBox from '@/components/SelectBox';
import { ButtonWithFeedback } from '@/components/Buttons';
import { Button } from '@/components/Buttons';

import BlackBackSvg from '@/assets/arrow_back_black.svg';
import WhiteBackSvg from '@/assets/arrow_back_white.svg';
import { Query, Mutation } from '@/graphql';
import Strings from '@/constants/strings';
import Icons from '@/constants/icons';
import appThemes from '@/constants/app-themes';
import GenderType from '@/constants/gender-type';
import SourceType from '@/constants/source-type';
import * as LP from '@/utils/list-pages';
import * as htrLocal from '@/utils/storage';

export default {
  name: 'AppSettings',
  components: {
    DropdownMenu,
    SelectBox,
    ButtonWithFeedback,
    Button
  },
  data: function() {
    return {
      id: 'app-settings',
      target: Strings.portal.modal,
      alignment: Strings.right,
      title: 'App Settings',
      icon: Icons.settings,
      appThemes,
      theme: '',
      setFeedbackButtonState: null,
      lightThemes: ['theme--one'],
      backIcon: null,
      backPortalTarget: Strings.portal.backButton,
      routeHistory: []
    };
  },
  watch: {
    $route: function(newRoute) {
      this.routeHistory.push(newRoute);
    }
  },
  computed: {
    themeName: {
      get: function() {
        return `theme--${this.theme}`;
      },
      set(value) {
        this.theme = value;
      }
    }
  },
  methods: {
    goBack: function() {
      this.$router.go(-1);
    },
    setBackIcon: function() {
      const isLightTheme = this.lightThemes.includes(this.themeName);
      this.backIcon = isLightTheme ? BlackBackSvg : WhiteBackSvg;
    },
    onChange: function(value) {
      document.body.classList.remove(this.themeName);
      this.themeName = htrLocal.saveTheme(value);
      this.setBackIcon();
      document.body.classList.add(this.themeName);
    },
    updateRankings: function() {
      this.setFeedbackButtonState({ isLoading: true });
      this.$apollo
        .mutate({
          mutation: Mutation.populateRankings,
          refetchQueries: [
            { query: Query.getTopTen },
            {
              query: Query.getRankingsPaged,
              variables: {
                search: '',
                genders: [...GenderType],
                sources: [...SourceType],
                series: [],
                paging: {
                  page: 0,
                  size: LP.size
                }
              }
            }
          ]
        })
        .then(() => this.setFeedbackButtonState({ isSuccess: true }))
        .catch(() => this.setFeedbackButtonState({ isFailure: true }));
    },
    getFeedbackUpdater: function(fn) {
      this.setFeedbackButtonState = fn;
    }
  },
  created() {
    this.themeName = htrLocal.getTheme();
    this.setBackIcon();
    document.body.classList.add(this.themeName);
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.app-settings {
  top: 50px;
  right: 5px;

  &__item {
    display: flex;
    justify-content: center;
    margin: $app--margin-small 0;
  }
}
</style>
