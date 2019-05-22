<template>
  <div class="htr-calendar">
    <div class="htr-calendar__controls">
      <Button
        :aria-label="prevLabel"
        :icon="prevIcon"
        class="htr-calendar__shift-button"
        @click="handleViewShift(-1)"
      />
      <Button class="htr-calendar__shift-button" @click="toggleViewMode">
        {{ controlText }}
      </Button>
      <Button
        :aria-label="nextLabel"
        :icon="nextIcon"
        class="htr-calendar__shift-button"
        @click="handleViewShift(1)"
      />
    </div>

    <div class="htr-calendar__view">
      <div
        v-for="header in headers"
        :key="header"
        class="htr-calendar__view-option htr-calendar__view-option--day htr-calendar__view-option--header"
      >
        {{ header }}
      </div>

      <div
        v-for="option in options"
        :key="option.key"
        :class="{
          'htr-calendar__view-option': true,
          'htr-calendar__view-option--day': isMonthView,
          'htr-calendar__view-option--month': !isMonthView,
          'htr-calendar__view-option--dummy-day': option.isDummyDay
        }"
      >
        <Button
          :class="{
            'htr-calendar__view-button': true,
            'htr-calendar__view-button--selected': isSelected(option)
          }"
          :title="option.title"
          :aria-label="option.ariaLabel"
          :disabled="option.disabled"
          @click="handleViewOptionSelect(option)"
        >
          {{ option.text }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from '@/components/Buttons';
import Icons from '@/constants/icons';
import Strings from '@/constants/strings';
import ViewOptionEnum from '@/constants/calendarViewOption';
import { formatDateForInput } from '@/utils/date';
import {
  displayMonthAndYear,
  displayYearOnly,
  getDaysForDate,
  getMonthsForDate,
  adjustDateMonth,
  adjustDateYear,
  checkIfSelectedForView
} from './calendarUtils';

export default {
  name: 'DateRangeCalendar',
  components: { Button },
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Date],
      required: true
    },
    afterDate: {
      type: [String, Date],
      default: null
    },
    beforeDate: {
      type: [String, Date],
      default: null
    }
  },
  data: function() {
    return {
      isMonthView: true,
      viewDate: new Date(this.value),
      prevIcon: Icons.left,
      nextIcon: Icons.right
    };
  },
  computed: {
    prevLabel: function() {
      return `Move to previous ${this.isMonthView ? 'year' : 'month'}`;
    },
    nextLabel: function() {
      return `Move to next ${this.isMonthView ? 'year' : 'month'}`;
    },
    controlText: function() {
      return this.isMonthView
        ? displayMonthAndYear(this.viewDate)
        : displayYearOnly(this.viewDate);
    },
    headers: function() {
      return this.isMonthView ? Strings.dayNames : [];
    },
    options: function() {
      const state = {
        viewDate: this.viewDate,
        afterDate: this.afterDate,
        beforeDate: this.beforeDate
      };

      return this.isMonthView ? getDaysForDate(state) : getMonthsForDate(state);
    }
  },
  methods: {
    toggleViewMode: function() {
      this.isMonthView = !this.isMonthView;
    },
    handleViewShift: function(direction) {
      this.viewDate = this.isMonthView
        ? adjustDateMonth(this.viewDate, direction)
        : adjustDateYear(this.viewDate, direction);
    },
    isSelected: function(option) {
      return checkIfSelectedForView(
        { selectedDate: this.value, viewDate: this.viewDate },
        option
      );
    },
    handleViewOptionSelect: function(option) {
      const oldViewDate = new Date(this.viewDate);

      if (option.optionType === ViewOptionEnum.DAY) {
        const viewDate = new Date(
          oldViewDate.getFullYear(),
          oldViewDate.getMonth(),
          option.text
        );

        this.viewDate = viewDate;
        this.$emit('change', formatDateForInput(viewDate), this.name);
      } else if (option.optionType === ViewOptionEnum.MONTH) {
        const monthIndex = Strings.monthNames.findIndex(
          (x) => x === option.text
        );

        this.viewDate = new Date(oldViewDate.getFullYear(), monthIndex, 1);
        this.isMonthView = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';
@import '../../styles/_mixins';

$button-padding: 8px;

.htr-calendar {
  display: flex;
  flex-direction: column;
  padding: 5px;
  box-sizing: border-box;

  &__controls {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }

  &__shift-button {
    padding: 3px 15px;
  }

  &__view {
    display: flex;
    flex-flow: wrap;

    &-option {
      text-align: center;
      border: 1px solid transparent;
      box-sizing: border-box;

      &:not(.htr-calendar__view-option--dummy-day):not(.htr-calendar__view-option--header) {
        border-color: #efefef;
      }

      &--day {
        width: calc(100% / 7);
      }

      &--month {
        width: calc(100% / 3);
      }

      &--header {
        padding: 5px 0;
      }

      &--dummy-day {
        z-index: -1;
        > button {
          background-color: inherit !important;
        }
      }
    }

    &-button {
      height: 100%;
      min-width: 100%;
      padding: {
        top: $button-padding;
        bottom: $button-padding;
      }

      @include respond-to-all((sm, xs)) {
        $button-padding-half: $button-padding / 2;
        padding: {
          top: $button-padding-half;
          bottom: $button-padding-half;
        }
      }
    }
  }
}
</style>
