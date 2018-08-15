<template>
    <DropdownMenu
        :id="id"
        :portal-target="target"
        :align="alignment"
        :title="title"
        :icon="icon"
    >
        <li>
            <SelectBox
                id="appTheme"
                name="appTheme"
                text="App Theme"
                :options="appThemes"
                :value="theme"
                @on-select="onChange"
            />
        </li>
    </DropdownMenu>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu';
import SelectBox from '@/components/SelectBox';

import Strings from '@/constants/strings';
import Icons from '@/constants/icons';
import appThemes from '@/constants/app-themes';

import * as htrLocal from '@/utils/storage';

export default {
  name: 'AppSettings',
  components: {
    DropdownMenu,
    SelectBox
  },
  data: function() {
    return {
      id: 'app-settings',
      target: Strings.portalName,
      alignment: Strings.right,
      title: 'App Settings',
      icon: Icons.settings,
      appThemes,
      theme: ''
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
  methods: {
    onChange: function(value) {
      document.body.classList.remove(this.themeName);
      this.themeName = htrLocal.saveTheme(value);
      document.body.classList.add(this.themeName);
    }
  },
  created() {
    this.themeName = htrLocal.getTheme();
    document.body.classList.add(this.themeName);
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';
</style>
