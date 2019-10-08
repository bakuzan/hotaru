<template>
  <div class="date-range-picker">
    <DateRangeCalendar
      :value="fromDate"
      :after-date="whenRecordsBegan"
      :before-date="toDate"
      name="fromDate"
      @change="handleDateChange"
    />
    <DateRangeCalendar
      :value="toDate"
      :after-date="fromDate"
      :before-date="today"
      name="toDate"
      @change="handleDateChange"
    />
  </div>
</template>

<script>
import DateRangeCalendar from '@/components/DateRangePicker/DateRangeCalendar';

export default {
  name: 'DateRangePicker',
  components: { DateRangeCalendar },
  props: {
    fromDate: {
      type: [String, Date],
      required: true
    },
    toDate: {
      type: [String, Date],
      required: true
    }
  },
  data: function() {
    return { whenRecordsBegan: new Date('2018-09-25'), today: new Date() };
  },
  methods: {
    handleDateChange: function(value, name) {
      this.$emit('change', value, name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/_variables';
@import '../../styles/_mixins';

.date-range-picker {
  display: flex;
  flex: 1;
  max-width: 100%;
  border: 1px solid transparent;

  @include respond-to-all((xs, sm)) {
    flex-wrap: wrap;
  }
}
</style>
