<template>
  <div>
    <DropdownMenu
      :id="id"
      :portal-target="target"
      :align="alignment"
      :title="title"
      :icon="icon"
      ignore-position
      class="app-settings"
    >
      <li class="app-settings__item">
        <SelectBox
          id="appTheme"
          :options="appThemes"
          :value="theme"
          name="appTheme"
          text="App Theme"
          @on-select="onChange"
        />
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
        <img :src="backIcon" alt="back arrow" />
      </Button>
    </portal>
  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu';
import SelectBox from '@/components/SelectBox';
import { Button } from '@/components/Buttons';

import BlackBackSvg from '@/assets/arrow_back_black.svg';
import WhiteBackSvg from '@/assets/arrow_back_white.svg';
import Strings from '@/constants/strings';
import Icons from '@/constants/icons';
import appThemes from '@/constants/appThemes';
import * as htrLocal from '@/utils/storage';

export default {
  name: 'AppSettings',
  components: {
    DropdownMenu,
    SelectBox,
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
      lightThemes: ['theme--one'],
      backIcon: null,
      backPortalTarget: Strings.portal.backButton,
      routeHistory: []
    };
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
  watch: {
    $route: function(newRoute) {
      this.routeHistory.push(newRoute);
    }
  },
  created() {
    this.themeName = htrLocal.getTheme();
    this.setBackIcon();
    document.body.classList.add(this.themeName);
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
    }
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
