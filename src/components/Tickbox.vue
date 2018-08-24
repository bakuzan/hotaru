<template>
  <div class="input-container">
    <label class="tickbox" :for="name">
      <input
        type="checkbox"
        class="tickbox__input"
        :id="name"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        @change="onChange"
      />
      {{text}}
    </label>
  </div>
</template>

<script>
export default {
  name: 'Tickbox',
  props: {
    name: {
      type: String,
      required: true
    },
    text: {
      type: String
    },
    checked: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    onChange: function(event) {
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
  appearance: none;
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
