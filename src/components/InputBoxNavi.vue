<template>
  <InputBoxAutocomplete 
    :id="id"
    class="input-navi"
    name="navigationFilter"
    label="Go To"
    attr="name"
    menuClass="input-navi__menu"
    :options="options"
    :filter="filter"
    @input="onInput"
    @on-select="onSelect"
  />
</template>

<script>
import InputBoxAutocomplete from '@/components/InputBoxAutocomplete';
import Strings from '@/constants/strings';
import Urls from '@/constants/urls';
import KeyCodes from '@/constants/key-codes';
import HTRTemplateType from '@/constants/htr-template-type';
import { generateUniqueId, createListeners } from '@/utils';

function mapToNaviOption(name, url) {
  return {
    id: generateUniqueId(),
    name,
    url
  };
}

function buildOptions() {
  return Object.keys(Strings.route).reduce((p, k) => {
    const name = Strings.route[k];
    const url = Urls[k];

    if (url.includes(':id')) return p;

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
  data: function() {
    return {
      id: 'navigation-Filter',
      filter: '',
      options: buildOptions(),
      shortcutController: null
    };
  },
  mounted() {
    this.shortcutController = createListeners('keydown', (e) => {
      if (e.ctrlKey && e.keyCode === KeyCodes.q) {
        this.$el.querySelector('input').focus();
      }
    })();
    this.shortcutController.listen();
  },
  beforeDestroy() {
    this.shortcutController.remove();
  },
  methods: {
    onInput: function(value) {
      this.filter = value;
    },
    onSelect: function(id) {
      this.filter = '';
      const navTo = this.options.find((x) => x.id === id);
      this.$router.push(navTo.url);
      this.$el.querySelector('input').blur();
    }
  }
};
</script>
