<template>
    <div :class="classes">
        <ViewBlock
            v-if="readOnly"
            :label="label"
            :value="value"
            :noDataText="noDataText"
            @toggle="onToggle"
        >
          <slot :name="childSlotName" :value="value"></slot>
        </ViewBlock>
        <slot v-if="!readOnly"></slot>
    </div>
</template>

<script>
import classNames from 'classnames';

import ViewBlock from '@/components/ViewBlock';
import Strings from '@/constants/strings';

export default {
  name: 'ViewBlockToggler',
  components: {
    ViewBlock
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    noDataText: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '',
      required: false
    },
    value: {
      type: [String, Number, Array],
      default: null
    },
    lockEdit: {
      type: Boolean,
      default: false
    },
    forceReadOnly: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      childSlotName: Strings.slot.viewBlock,
      isEditing: false
    };
  },
  watch: {
    forceReadOnly: function(newV, oldV) {
      if (newV && newV !== oldV) {
        this.isEditing = false;
      }
    }
  },
  computed: {
    readOnly: function() {
      return !this.lockEdit && !this.isEditing;
    },
    classes: function() {
      return classNames('view-block-toggler', {
        'view-block-toggler--read-only': this.readOnly
      });
    }
  },
  methods: {
    onToggle: function() {
      this.isEditing = !this.isEditing;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables';

.view-block-toggler {
  margin: $app--margin-standard 0;
}
</style>
