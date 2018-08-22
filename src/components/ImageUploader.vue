<template>
  <div class="image-selector">
    <InputBox 
      class="image-selector__input-box"
      clearButtonClass="image-selector__clear"
      id="imageUrl"
      name="imageUrl"
      label="Image Url"
      :value="imageUrl"
      @input="onInput"
    />
    <Button
      className="image-selector__upload"
      size="small"
      theme="primary"
      @click="onUploadClick"
    >
      <img :src="uploadIcon" />
    </Button>
    <div class="image-selector__file-selector">
      <div class="image-selector__label">{{imageFileName}}</div>
      <Button
        className="image-selector__upload"
        size="small"
        theme="primary"
        @click="onFileClick"
      >
        <img :src="uploadIcon" />
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
import UploadSvg from '@/assets/upload.svg';

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
      uploadIcon: UploadSvg,
      fileInputId: generateUniqueId(),
      imageUrl: '',
      imageFile: null
    };
  },
  computed: {
    imageFileName: function() {
      const filename = this.imageFile && this.imageFile.name;
      return filename || 'No file selected';
    }
  },
  methods: {
    onInput: function(value) {
      this.imageUrl = value;
    },
    onUploadClick: function() {
      this.uploadUrl();
    },
    onFileClick: function() {
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
      console.log('upload url');
    },
    uploadBase64: function(event) {
      const base64 = event.target.result;
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
  position: relative;
  padding: #{$app--padding-standard * 2} 0;

  &__input-box {
    padding: 0;
  }
  &__upload {
    position: absolute;
    top: 15px;
    right: 0px;
    padding: $app--padding-small;
  }

  &__label {
    padding: #{$app--padding-standard * 2};
  }
  &__file-selector {
    position: relative;
  }
  &__file-input {
    display: none;
  }
}
</style>
<style lang="scss">
.image-selector__clear {
  right: 60px;
  padding: 0;
  margin: 0;
}
</style>
