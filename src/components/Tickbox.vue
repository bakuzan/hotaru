<template>
  <div class="input-container">
    <label :class="tickboxClasses" :for="name">
      <input
        :id="name"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        type="checkbox"
        class="tickbox__input"
        @change="onChange"
      />
      {{ text }}
    </label>
  </div>
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'Tickbox',
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    customTickbox: {
      type: String,
      default: ''
    }
  },
  computed: {
    tickboxClasses: function () {
      return classNames('tickbox', this.customTickbox);
    }
  },
  methods: {
    onChange: function (event) {
      this.$emit('change', event.target.checked, this.name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables';

.tickbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px;
  cursor: pointer;
}
.tickbox__input {
  // eslint-disable-next-line
  appearance: none; // scss-lint:disable-line unknown-property
  transition: all 0.3s;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin: 0 5px;

  &:before,
  &:checked:before {
    color: #000;
    transition: all 0.3s;
    cursor: pointer;
    z-index: map-get($z-index, wafer);
  }

  &:before {
    content: '\2610';
    font-size: 2em;
  }

  &:disabled:before {
    content: '\274c';
    color: #666;
    cursor: default;
  }

  &:checked:before {
    content: '\2611';
    color: #0f0;
  }
}
</style>
