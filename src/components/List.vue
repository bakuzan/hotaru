<template>
  <div>
    <div v-if="hasPaging" class="paged-total">{{ totalText }}</div>
    <draggable
      ref="listContainer"
      v-bind="sortableOptions"
      :class="listClasses"
      :list="items"
      tag="ul"
      @update="onUpdate"
    >
      <li v-for="item in items" :key="item.id" :class="listItemClasses">
        <div v-if="isSortable" class="sort-handle">+</div>
        <slot :item="item">
          <!-- Fallback content -->
          {{ item.id }}
        </slot>
      </li>
    </draggable>
  </div>
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
    className: {
      type: String,
      default: ''
    },
    itemClassName: {
      type: String,
      default: ''
    },
    columns: {
      type: String,
      default: '',
      validator: function (value) {
        return ['', 'one', 'two', 'three', 'four', 'five'].includes(value);
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    wrap: {
      type: Boolean,
      default: false
    },
    isSortable: {
      type: Boolean,
      default: false
    },
    pagedTotal: {
      type: Number,
      default: null
    },
    alignLeft: {
      type: Boolean,
      default: false
    },
    fixedWidth: {
      type: Boolean,
      default: false
    },
    isGrid: {
      default: false,
      validator: function (value) {
        return value === 'standard' || value === true || value === false;
      }
    }
  },
  data: function () {
    return {
      observer: null,
      listObserver: null
    };
  },

  computed: {
    listClasses: function () {
      return classNames(
        !this.isGrid && {
          list: true,
          'list--wrap': this.wrap,
          'list--column': this.columns,
          [`list--column_${this.columns}`]: this.columns
        },
        this.isGrid && {
          grid: true,
          'grid--standard': this.isGrid === 'standard'
        },
        this.className
      );
    },
    listItemClasses: function () {
      return classNames(
        this.itemClassName,
        !this.isGrid && {
          list__item: true,
          'list__item--align_left': this.alignLeft,
          'list__item--fixed-width': this.fixedWidth
        },
        this.isGrid && { grid__item: true }
      );
    },
    sortableOptions: function () {
      return {
        disabled: !this.isSortable,
        handle: '.sort-handle'
      };
    },
    hasPaging: function () {
      return !(this.pagedTotal === null || isNaN(this.pagedTotal));
    },
    totalText: function () {
      return `Displaying ${this.items.length} of ${this.pagedTotal}`;
    }
  },
  mounted() {
    this.setMutationOberver();
    if (this.items.length) {
      // When Items loaded from cache
      const listNode = this.getListRef();
      const lastItem = Array.from(listNode.children).pop();
      this.setIntersectionObserver(lastItem);
    }
  },
  destroyed() {
    if (this.listObserver) {
      this.listObserver.disconnect();
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    getListRef: function () {
      return this.$refs.listContainer.$el;
    },
    setMutationOberver: function () {
      if (this.listObserver) {
        this.listObserver.disconnect();
      }

      const targetNode = this.getListRef();
      this.listObserver = new MutationObserver((mutations) => {
        const record = mutations.filter((x) => x.addedNodes.length).pop();
        if (record) {
          const element = Array.from(record.addedNodes).pop();
          this.setIntersectionObserver(element);
        }
      });

      this.listObserver.observe(targetNode, {
        attributes: false,
        childList: true,
        subtree: false
      });
    },
    setIntersectionObserver: function (targetNode) {
      if (this.observer) {
        this.observer.disconnect();
      }
      if (!targetNode) {
        return;
      }

      this.observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          this.$emit('intersect');
        }
      });

      this.observer.observe(targetNode);
    },
    onUpdate: function (...stuff) {
      this.$emit('update', ...stuff);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/_mixins.scss';
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
        &.list__item--fixed-width {
          flex: 0 0 $percentage;
        }
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
  &--align_left {
    justify-content: flex-start;
  }
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
.paged-total {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.33rem;
  font-size: 0.6em;
}
// Grid styles
.grid {
  display: grid;
  padding: 5px;
  margin: 5px 0;
  list-style-type: none;
  &--standard {
    $grid-values: (
      xs: 50,
      sm: 33,
      md: 25,
      lg: 20
    );
    @include gridColumnGenerator($grid-values);
  }
}
</style>
