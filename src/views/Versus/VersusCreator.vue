<template>
  <form novalidate @submit.prevent="submit">
    <div class="page page-view versus-creator">
      <div>
        - gender (inc/ex)
        - series (inc/ex)
        ? series source (inc/ex)
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

import Strings from '@/constants/strings';


export default {
  name: 'VersusCreator',
  components: {
    Button,
  },
  data: function() {
    return {
      portalTarget: Strings.portal.actions,
    };
  },
  computed: {
    showButtons: function() {
      return true;
    }
  },
  methods: {
    submit: function() {
      console.log('submit!');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';

</style>

<style lang="scss" src="../../styles/_page-view.scss" />
