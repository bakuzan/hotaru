<template>
  <div
    :ref="calendarRef"
    class="htr-calendar"
    @keydown="handleCalendarNavigation"
  >
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
          'htr-calendar__view-option--disabled': option.disabled,
          'htr-calendar__view-option--dummy-day': option.isDummyDay,
          'htr-calendar__view-option--selected': isSelected(option)
        }"
        :data-date="option.text"
        :tabindex="getTabIndex(option)"
        :title="option.title"
        :aria-label="option.ariaLabel"
        @click="handleViewOptionSelect(option)"
        @keydown.enter="handleViewOptionSelect(option)"
        @keydown.space.prevent="handleViewOptionSelect(option)"
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from '@/components/Buttons';

import Icons from '@/constants/icons';
import Strings from '@/constants/strings';
import KeyCodes, { ARROW_KEYS } from '@/constants/keyCodes';
import ViewOptionEnum from '@/constants/calendarViewOption';
import { generateUniqueId } from '@/utils';
import {
  formatDateForInput,
  startOfDay,
  checkIfDatePartsMatch,
  getFirstDateOfMonth
} from '@/utils/date';
import {
  displayMonthAndYear,
  displayYearOnly,
  getDaysForDate,
  getMonthsForDate,
  adjustDateDay,
  adjustDateMonth,
  adjustDateYear,
  checkIfSelectedForView
} from './calendarUtils';

const dayNames = [...Strings.dayNames.slice(1), Strings.dayNames[0]];

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
  data: function () {
    const initDate = startOfDay(this.value);

    return {
      calendarRef: generateUniqueId(),
      isMonthView: true,
      viewDate: initDate,
      focusDate: initDate,
      prevIcon: Icons.left,
      nextIcon: Icons.right
    };
  },
  computed: {
    prevLabel: function () {
      return `Move to previous ${this.isMonthView ? 'month' : 'year'}`;
    },
    nextLabel: function () {
      return `Move to next ${this.isMonthView ? 'month' : 'year'}`;
    },
    controlText: function () {
      return this.isMonthView
        ? displayMonthAndYear(this.viewDate)
        : displayYearOnly(this.viewDate);
    },
    headers: function () {
      return this.isMonthView ? dayNames : [];
    },
    options: function () {
      const state = {
        viewDate: this.viewDate,
        afterDate: this.afterDate,
        beforeDate: this.beforeDate
      };

      return this.isMonthView ? getDaysForDate(state) : getMonthsForDate(state);
    }
  },
  methods: {
    toggleViewMode: function () {
      const matches = checkIfDatePartsMatch(this.viewDate, this.value);

      this.isMonthView = !this.isMonthView;
      this.focusDate = new Date(
        matches.year && matches.month ? this.value : this.viewDate
      );
    },
    handleViewShift: function (direction) {
      const newDate = this.isMonthView
        ? adjustDateMonth(this.viewDate, direction)
        : adjustDateYear(this.viewDate, direction);

      this.viewDate = getFirstDateOfMonth(newDate);
      this.focusDate = new Date(newDate);
    },
    isSelected: function (option) {
      return checkIfSelectedForView(
        { selectedDate: this.value, viewDate: this.viewDate },
        option
      );
    },
    getTabIndex: function (option) {
      const viewDate = new Date(this.viewDate);
      let optionDate = null;

      if (option.optionType === ViewOptionEnum.DAY) {
        optionDate = new Date(
          viewDate.getFullYear(),
          viewDate.getMonth(),
          option.text
        );
      } else if (option.optionType === ViewOptionEnum.MONTH) {
        const monthIndex = Strings.monthNames.findIndex(
          (x) => x === option.text
        );

        optionDate = new Date(viewDate.getFullYear(), monthIndex, 1);
      }

      if (this.focusDate === null || optionDate === null) {
        return -1;
      }

      if (this.isMonthView) {
        return this.focusDate.getTime() === optionDate.getTime() ? 0 : -1;
      } else {
        return this.focusDate.getMonth() === optionDate.getMonth() ? 0 : -1;
      }
    },
    handleViewOptionSelect: function (option) {
      if (option.disabled) {
        return;
      }

      const oldViewDate = new Date(this.viewDate);

      if (option.optionType === ViewOptionEnum.DAY) {
        const viewDate = new Date(
          oldViewDate.getFullYear(),
          oldViewDate.getMonth(),
          option.text
        );

        this.viewDate = viewDate;
        this.focusDate = new Date(viewDate);
        this.$emit('change', formatDateForInput(viewDate), this.name);
      } else if (option.optionType === ViewOptionEnum.MONTH) {
        const monthIndex = Strings.monthNames.findIndex(
          (x) => x === option.text
        );

        const newDate = new Date(oldViewDate.getFullYear(), monthIndex, 1);
        const matches = checkIfDatePartsMatch(newDate, this.value);

        this.focusDate = new Date(
          matches.year && matches.month ? this.value : newDate
        );
        this.viewDate = getFirstDateOfMonth(newDate);
        this.isMonthView = true;
      }

      this.setFocus();
    },
    handleCalendarNavigation: function (event) {
      const { key } = event;
      const currFocusDate = new Date(this.focusDate);
      let newDate = null;

      if (ARROW_KEYS.includes(key)) {
        event.preventDefault();
      }

      switch (key) {
        case KeyCodes.ArrowUp:
          newDate = this.isMonthView
            ? adjustDateDay(currFocusDate, -7)
            : adjustDateMonth(currFocusDate, -3);
          break;
        case KeyCodes.ArrowDown:
          newDate = this.isMonthView
            ? adjustDateDay(currFocusDate, 7)
            : adjustDateMonth(currFocusDate, 3);
          break;
        case KeyCodes.ArrowLeft:
          newDate = this.isMonthView
            ? adjustDateDay(currFocusDate, -1)
            : adjustDateMonth(currFocusDate, -1);
          break;
        case KeyCodes.ArrowRight:
          newDate = this.isMonthView
            ? adjustDateDay(currFocusDate, 1)
            : adjustDateMonth(currFocusDate, 1);
          break;
        default:
          break;
      }

      if (!newDate) {
        return;
      }

      this.viewDate = getFirstDateOfMonth(newDate);
      this.focusDate = new Date(newDate);
      this.setFocus();
    },
    setFocus: function () {
      requestAnimationFrame(() => {
        const container = this.$refs[this.calendarRef];
        const dx = this.isMonthView
          ? this.focusDate.getDate()
          : Strings.monthNames[this.focusDate.getMonth()];

        const target = container.querySelector(`[data-date='${dx}']`);

        if (target) {
          target.focus();
        }
      });
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
  max-width: 50%;
  padding: 5px;
  border: 1px solid transparent;
  margin: 1px;
  box-sizing: border-box;

  @include respondToAll((sm, xs)) {
    width: 100%;
    max-width: 100%;
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__shift-button {
    min-width: 25px;
    padding: 3px 15px;
  }

  &__view {
    display: flex;
    flex-flow: wrap;

    &-option {
      padding: {
        top: $button-padding;
        bottom: $button-padding;
      }
      text-align: center;
      border: 1px solid transparent;
      box-sizing: border-box;
      cursor: pointer;

      @include respondToAll((sm, xs)) {
        $button-padding-half: $button-padding / 2;

        padding: {
          top: $button-padding-half;
          bottom: $button-padding-half;
        }
      }

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
        cursor: default;
      }

      &--disabled {
        background-color: $grey80 !important;
        color: $grey40 !important;
        cursor: default;
      }

      &--dummy-day {
        z-index: -1;
        background-color: inherit !important;
      }
    }
  }
}
</style>
