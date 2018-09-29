<template>
  <div>
    <draggable 
      :class="listClasses"
      element="ul"
      :list="items"
      :options="sortableOptions"
      @update="onUpdate"
    >
        <li v-for="item in items" :class="listItemClasses" :key="item.id">
            <div class="sort-handle" v-if="isSortable">+</div>
            <slot v-bind:item="item">
            <!-- Fallback content -->
            {{ item.id }}
            </slot>
        </li>
    </draggable>
    <div ref="observedDiv" class="observer"></div>
  </div>
</template>

<script>
import classNames from 'classnames';
import draggable from 'vuedraggable';

import { infiniteScroll } from '@/utils';

export default {
  name: 'List',
  components: {
    draggable
  },
  props: {
    className: String,
    itemClassName: String,
    columns: {
      type: String,
      default: '',
      validator: function(value) {
        return ['', 'one', 'two', 'three', 'four', 'five'].includes(value);
      }
    },
    items: Array,
    wrap: {
      type: Boolean,
      default: false
    },
    isSortable: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      observer: null
    };
  },
  mounted() {
    this.observer = infiniteScroll(this.$el, ([entry]) =>
      this.$emit('intersect')
    );
    this.observer.observe(this.$refs.observedDiv);
  },
  destroyed() {
    this.observer.disconnect();
  },
  computed: {
    listClasses: function() {
      return classNames(
        'list',
        {
          'list--wrap': this.wrap,
          'list--column': this.columns,
          [`list--column_${this.columns}`]: this.columns
        },
        this.className
      );
    },
    listItemClasses: function() {
      return classNames('list__item', this.itemClassName);
    },
    sortableOptions: function() {
      return {
        disabled: !this.isSortable,
        handle: '.sort-handle'
      };
    }
  },
  methods: {
    onUpdate: function(...stuff) {
      this.$emit('update', ...stuff);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/_extensions.scss';

$columns: (
  one: 100%,
  two: 50%,
  three: 33%,
  four: 25%,
  five: 20%
);

.list {
  display: flex;
  flex-direction: row;
  width: calc(100% - 10px);
  padding: 5px;
  margin: 5px 0;
  list-style-type: none;
  .formatting-container {
    display: flex;
    width: 100%;
  }
  &--column {
    flex-direction: column;
    &:not(.list--column_one) {
      flex-flow: wrap;
    }
    @each $number, $percentage in $columns {
      &_#{$number} .list__item {
        flex: 1 1 $percentage;
      }
    }
  }
  &--wrap {
    flex-wrap: wrap;
  }
}
.list__item {
  position: relative;
  display: flex;
  justify-content: center;
  padding: $app--padding-standard;
  @extend %standard-border;
  box-sizing: border-box;
}
.sort-handle {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 1em;
  height: 1em;
  border: 1px dashed;
  z-index: map-get($z-index, above-siblings);
}
.observer {
  width: 100%;
  height: 5px;
}
</style>
