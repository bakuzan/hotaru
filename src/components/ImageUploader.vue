<template>
  <div class="image-selector">
    <InputBox 
      id="imageUrl"
      name="imageUrl"
      label="Image Url"
      :value="imageUrl"
      @input="onInput"
    />
    <div class="image-selector__file-selector">
      <div>{{imageFileName}}</div>
      <Button
        theme="primary"
        @click="onClick"
      >
        Upload
      </Button>
      <input 
        type="file" 
        accept="image/*" 
        class="image-selector__file-input" 
        :id="fileInputId"
        @change="onFileChange"
      />
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';

import { generateUniqueId, convertToBase64 } from '@/utils';

export default {
  name: 'ImageUploader',
  components: {
    Button,
    InputBox
  },
  props: {},
  data: function() {
    return {
      fileInputId: generateUniqueId(),
      imageUrl: '',
      imageFile: null
    };
  },
  computed: {
    imageFileName: function() {
      const filename = this.imageFile && this.imageFile.name;
      return filename || 'No image selected';
    }
  },
  methods: {
    onInput: function(value) {
      this.imageUrl = value;
    },
    onClick: function() {
      const fileinput = document.getElementById(this.fileInputId);
      fileinput.click();
    },
    onFileChange: function(event) {
      const { files } = event.target;
      const hasFiles = !!files && files.length;

      if (hasFiles) {
        this.imageFile = hasFiles ? files[0] : null;
        convertToBase64(this.imageFile, this.uploadBase64);
      }
    },
    uploadUrl: function() {
      // call mutation here for url
    },
    uploadBase64() {
      const base64 = this.result;
      console.log(this, base64);
      // call mutation here for base64
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/_extensions.scss';

.image-selector {
  &__file-input {
    display: none;
  }
}
</style>
