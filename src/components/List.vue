<template>
    <draggable 
      :class="listClasses"
      element="ul"
      v-model="items"
      :options="sortableOptions"
      @update="onUpdate"
    >
        <li v-for="item in items" :class="listItemClasses" :key="item.id">
            <slot v-bind:item="item">
            <!-- Fallback content -->
            {{ item.id }}
            </slot>
        </li>
    </draggable>
</template>

<script>
import classNames from 'classnames';
import draggable from 'vuedraggable';

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
      return { disabled: !this.isSortable };
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
  display: flex;
  justify-content: center;
  padding: $app--padding-standard;
  @extend %standard-border;
  box-sizing: border-box;
}
</style>
