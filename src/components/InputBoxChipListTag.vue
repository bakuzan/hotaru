<template>
    <span
      :class="classes"
      v-bind="tagAccessiblityIfClickable"
      @click="onClick"
    >
        <span class="chip-tag__text">{{data.name}}</span>
        <Button
            v-if="hasRemove"
            class-name="chip-tag__delete"
            size="small"
            title="remove"
            :icon="removeIcon"
            @click="onRemove"
        />
    </span>
</template>

<script>
import classNames from 'classnames';

import Button from '@/components/Button';

import Icons from '@/constants/icons';

export default {
  name: 'InputBoxChipListTag',
  components: {
    Button
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      required: true
    },
    hasClick: {
      type: Boolean,
      default: false
    },
    hasRemove: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return { removeIcon: Icons.cross };
  },
  computed: {
    classes: function() {
      return classNames('chip-tag', this.class, {
        'chip-tag--clickable': this.hasClick,
        'chip-tag--deletable': this.hasRemove,
        'chip-tag--active': this.isActive
      });
    },
    tagAccessiblityIfClickable: function() {
      if (!this.hasClick) return {};
      return {
        role: 'button',
        tabIndex: '0'
      };
    }
  },
  methods: {
    onClick: function() {
      this.$emit('click', this.data);
    },
    onRemove: function() {
      this.$emit('remove', this.data);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';

.chip-tag {
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 16px;
  background-color: $chip-tag--background;
  display: inline-block;
  color: rgba(0, 0, 0, 0.87);
  margin: 1px 0;
  font-size: 0;
  white-space: nowrap;

  &--deletable {
    padding-right: 4px;
  }

  &--clickable {
    cursor: pointer;
  }

  &--active,
  &--active .chip-tag__delete {
    background-color: darken($chip-tag--background, $app--darken-amount);
    color: $white;
  }

  &__delete {
    display: inline-block !important;
    vertical-align: middle;
    overflow: hidden;
    text-align: center;
    height: 24px;
    width: 24px;
    background: 0 0;
    opacity: 0.54;
    cursor: pointer;
    padding: 0;
    margin: 0 0 0 4px;
    font-size: 13px;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.87);
    border: none;
    outline: none;
  }

  &__text {
    font-size: 13px;
    vertical-align: middle;
    display: inline-block;
  }
}
</style>
