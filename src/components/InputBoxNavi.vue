<template>
  <InputBoxAutocomplete
    :id="id"
    :options="options"
    :filter="filter"
    class="input-navi"
    name="navigationFilter"
    label="Go To"
    attr="name"
    menu-class="input-navi__menu"
    portal-menu
    @input="onInput"
    @on-select="onSelect"
  />
</template>

<script>
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import KeyCodes from '@/constants/keyCodes';
import HTRTemplateType from '@/constants/htrTemplateType';
import { generateUniqueId, createListeners } from '@/utils';

const excludes = ['pageNotFound'];

function mapToNaviOption(name, url) {
  return {
    id: generateUniqueId(),
    name,
    url
  };
}

function buildOptions() {
  return Object.keys(Strings.route)
    .filter((x) => !excludes.includes(x))
    .reduce((p, k) => {
      const name = Strings.route[k];
      const url = Urls[k];

      if (!url || url.includes(':id')) {
        return p;
      }

      const newOptions = !url.includes(':type')
        ? [mapToNaviOption(name, url)]
        : HTRTemplateType.map((t) =>
            mapToNaviOption(`${name} - ${t}`, url.replace(':type', t))
          );

      return [...p, ...newOptions];
    }, []);
}

export default {
  name: 'InputBoxNavi',
  components: {
    InputBoxAutocomplete
  },
  data: function () {
    return {
      id: 'navigation-Filter',
      filter: '',
      options: buildOptions(),
      shortcutController: null
    };
  },
  mounted() {
    this.shortcutController = createListeners('keydown', (e) => {
      if (e.ctrlKey && e.key === KeyCodes.KeyQ) {
        this.$el.querySelector('input').focus();
      }
    })();
    this.shortcutController.listen();
  },
  beforeDestroy() {
    this.shortcutController.remove();
  },
  methods: {
    onInput: function (value) {
      this.filter = value;
    },
    onSelect: function (id) {
      this.filter = '';
      const navTo = this.options.find((x) => x.id === id);
      this.$router.push(navTo.url);
      this.$el.querySelector('input').blur();
    }
  }
};
</script>

<style lang="scss">
@import '../styles/_variables';

.vue-portal-target .input-navi__menu {
  position: fixed;
  top: $header--height;
  left: #{$sidebar--width + 5};
  right: unset;
  bottom: unset;
  width: 235px;
  transform: none;

  .suggestion__button {
    justify-content: flex-start;
  }
}
</style>
