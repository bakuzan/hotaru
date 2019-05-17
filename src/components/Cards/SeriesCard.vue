<template>
  <div class="series-card">
    {{ name }}
    <Button
      :icon="removeIcon"
      class="series-card__remove"
      size="small"
      @click="onClick"
    />
  </div>
</template>

<script>
import { Button } from '@/components/Buttons';

import Icons from '@/constants/icons';

export default {
  name: 'SeriesCard',
  components: {
    Button
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data: function() {
    return { removeIcon: Icons.cross };
  },
  methods: {
    onClick: function() {
      this.$emit('remove', this.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.series-card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>
