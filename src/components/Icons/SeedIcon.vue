<template>
  <BaseIcon v-bind="$props" :icon="seedIcon" title="Is Seeded" />
</template>

<script>
import BaseIcon from '@/components/Icons/BaseIcon';
import Icons from '@/constants/icons';

export default {
  name: 'SeedIcon',
  components: {
    BaseIcon
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return { seedIcon: Icons.seed };
  }
};
</script>
