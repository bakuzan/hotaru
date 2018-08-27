<template>
    <div :class="tabsClasses">
        <ul class="tabs__controls" role="tablist">
            <li
                v-for="(tab, i) in tabs"
                :key="i"
                :class="getTabClasses(tab)"
                role="presentation"
                v-show="tab.isVisible"
            >
                <a 
                   :aria-controls="tab.tabHash"
                   :aria-selected="tab.isActive"
                   :href="tab.tabHash"
                   class="tab__option"
                   role="tab"
                   @click="selectTab(tab.tabHash, $event)"
                >
                {{tab.text}}
                </a>
            </li>
        </ul>
        <div class="tabs__container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'Tabs',
  props: {
    isLocked: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      tabs: [],
      activeTab: ''
    };
  },
  computed: {
    hasTabOptions: function() {
      return !!this.tabs.length;
    },
    tabsClasses: function() {
      return classNames('tabs', {
        'tabs--is-locked': this.isLocked
      });
    }
  },
  created() {
    this.tabs = this.$children;
  },
  mounted() {
    window.addEventListener('hashchange', () =>
      this.selectTab(window.location.hash)
    );

    const tab = this.findTab(window.location.hash);
    if (tab) {
      this.selectTab(window.location.hash);
      return;
    }

    if (this.hasTabOptions) {
      this.selectTab(this.tabs[0].tabHash);
    }
  },
  methods: {
    getTabClasses: function(tab) {
      return classNames('tabs__tab tab', {
        'tab--active': tab.isActive,
        'tab--disabled': tab.isDisabled
      });
    },
    findTab(hash) {
      return this.tabs.find((tab) => tab.tabHash === hash);
    },
    selectTab(hash) {
      const tab = this.findTab(hash);

      if (!tab) return;
      if (tab.isDisabled) return;

      this.tabs.forEach((t) => {
        t.isActive = t.tabHash === tab.tabHash;
        t.isLocked = this.isLocked;
      });

      this.$emit('updated', tab);
      this.activeTab = tab.tabHash;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/_variables.scss';
@import '../../styles/_extensions.scss';

$tab-controls-height: 35px;

.tabs {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 5px 0;

  &__container {
    position: relative;
    height: calc(100% - #{$tab-controls-height});
    min-width: 400px;
    // border-top: 1px solid $primary-colour;
    // border: 1px solid transparent;
  }

  &__controls {
    display: flex;
    height: $tab-controls-height;
    padding: 0;
    margin: -1px;
    white-space: nowrap;
    list-style-type: none;
  }

  &__tab {
    display: inline-flex;
    padding: 2px;
    margin: 0 1px;
    border: {
      width: 1px;
      style: solid;
      // color: $grey80;
      // bottom-color: $white;
    }
    z-index: map-get($z-index, above-siblings);
  }
}

.tab {
  display: flex;
  align-items: center;
  padding: $app--padding-standard;

  &--active {
    // border: {
    //   color: $primary-colour;
    //   bottom-color: $white;
    // }
    // margin-bottom: -1px;
  }

  &__option {
    color: inherit;
    text-decoration: none;
  }
}
</style>
