<template>
  <BaseIcon v-bind="$props" :icon="icon" title="Has Winner"/>
</template>

<script>
import BaseIcon from '@/components/Icons/BaseIcon';
import Icons from '@/constants/icons';

export default {
  name: 'TrophyIcon',
  components: {
    BaseIcon
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return { icon: Icons.trophy };
  }
};
</script>
