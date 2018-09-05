<template>
    <DropdownMenu
        :id="id"
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
          >
            Update Rankings
          </ButtonWithFeedback>
        </li>
    </DropdownMenu>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu';
import SelectBox from '@/components/SelectBox';
import { ButtonWithFeedback } from '@/components/Buttons';

import { Query, Mutation } from '@/graphql';
import Strings from '@/constants/strings';
import Icons from '@/constants/icons';
import appThemes from '@/constants/app-themes';

import * as htrLocal from '@/utils/storage';

export default {
  name: 'AppSettings',
  components: {
    DropdownMenu,
    SelectBox,
    ButtonWithFeedback
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
      setFeedbackButtonState: null
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
    },
    updateRankings: function() {
      this.setFeedbackButtonState({ isLoading: true });
      this.$apollo
        .mutate({
          mutation: Mutation.populateRankings,
          refetchQueries: [{ query: Query.getTopTen }]
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
    document.body.classList.add(this.themeName);
  }
};
</script>


<style lang="scss" scoped>
@import '../styles/_variables';

.app-settings__item {
  display: flex;
  justify-content: center;
  margin: $app--margin-small 0;
}
</style>
