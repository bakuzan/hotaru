<template>
  <div ref="listContainer">
    <div v-if="hasPaging" class="paged-total">{{totalText}}</div>
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
    <div ref="observedDiv" v-show="showObserver" class="observer"></div>
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
    className: String,
    itemClassName: String,
    columns: {
      type: String,
      default: '',
      validator: function(value) {
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
      type: Number
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
      validator: function(value) {
        return value === 'standard' || value === true || value === false;
      }
    }
  },
  data: function() {
    return {
      observer: null,
      showObserver: true,
      timer: null
    };
  },
  mounted() {
    this.$watch(
      function() {
        return this.items.length;
      },
      function(curr, prev) {
        if (!this.observer && prev === 0 && curr > 0) {
          this.setIntersectionObserver();
        }

        const currMatchesTotal = curr === this.pagedTotal;
        const prevMatchesTotal = prev === this.pagedTotal;
        if (prevMatchesTotal && !currMatchesTotal) {
          this.showObserver = false;

          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.showObserver = true;
          }, 100);
        }
      }
    );
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  computed: {
    listClasses: function() {
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
    listItemClasses: function() {
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
    sortableOptions: function() {
      return {
        disabled: !this.isSortable,
        handle: '.sort-handle'
      };
    },
    hasPaging: function() {
      return !(this.pagedTotal === null || isNaN(this.pagedTotal));
    },
    totalText: function() {
      return `Displaying ${this.items.length} of ${this.pagedTotal}`;
    }
  },
  methods: {
    setIntersectionObserver: function() {
      const container = this.$refs.listContainer;
      const itemClass = this.isGrid ? '.grid__item' : '.list__item';
      const element = container.querySelector(itemClass);
      const offset = element ? element.clientHeight / 2 : 50;
      const rootMargin = offset >= 50 ? `${offset}px` : '50px';

      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry && entry.isIntersecting) {
            this.$emit('intersect');
          }
        },
        {
          rootMargin
        }
      );
      this.observer.observe(this.$refs.observedDiv);
    },
    onUpdate: function(...stuff) {
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
    @include respond-to(xs) {
      @include gridColumnsForPercentage(50);
    }
    @include respond-to(sm) {
      @include gridColumnsForPercentage(33);
    }
    @include respond-to(md) {
      @include gridColumnsForPercentage(25);
    }
    @include respond-to(lg) {
      @include gridColumnsForPercentage(20);
    }
  }
}
</style>
