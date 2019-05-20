<template>
  <div class="image-selector">
    <LoadingBouncer v-show="isLoading" local />
    <InputBox
      :id="inputBoxId"
      :name="inputBoxId"
      :value="imageUrl"
      label="Image Url"
      class="image-selector__input-box"
      clear-button-class="image-selector__clear"
      @input="onInput"
    />
    <Button
      class="image-selector__upload"
      size="small"
      theme="primary"
      name="uploadImageUrl"
      @click="onUploadClick"
    >
      <img :src="uploadIcon" alt="Image Upload icon" />
    </Button>
    <div class="image-selector__file-selector">
      <div class="image-selector__label">{{ imageFileName }}</div>
      <Button
        class="image-selector__upload"
        size="small"
        theme="primary"
        name="uploadImageFile"
        @click="onFileClick"
      >
        <img :src="uploadIcon" alt="Image Upload icon" />
      </Button>
      <input
        :id="fileInputId"
        :name="fileInputId"
        type="file"
        accept="image/*"
        class="image-selector__file-input"
        @change="onFileChange"
      />
    </div>
  </div>
</template>

<script>
import { Button } from '@/components/Buttons';
import InputBox from '@/components/InputBox';
import UploadSvg from '@/assets/upload.svg';
import LoadingBouncer from '@/components/LoadingBouncer';

import { Mutation } from '@/graphql';
import { generateUniqueId, convertToBase64 } from '@/utils';

export default {
  name: 'ImageUploader',
  components: {
    Button,
    InputBox,
    LoadingBouncer
  },
  props: {
    name: {
      type: String,
      default: 'displayImage'
    }
  },
  data: function() {
    return {
      baseId: generateUniqueId(),
      uploadIcon: UploadSvg,
      imageUrl: '',
      imageFile: null,
      mutationUploading: false
    };
  },
  computed: {
    imageFileName: function() {
      const filename = this.imageFile && this.imageFile.name;
      return filename || 'No file selected';
    },
    fileInputId: function() {
      return `file-input-${this.baseId}`;
    },
    inputBoxId: function() {
      return `input-box-${this.baseId}`;
    },
    isLoading: function() {
      return this.mutationUploading;
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
      this.mutationUploading = true;
      this.$apollo
        .mutate({
          mutation: Mutation.uploadImageUrl,
          variables: { payload: this.imageUrl }
        })
        .then(({ data }) => {
          const result = data.uploadImageUrl;
          this.mutationUploading = false;
          if (result.success) {
            this.$emit('on-upload', result.url, this.name);
          }
        });
    },
    uploadBase64: function(event) {
      const base64 = event.target.result;

      this.mutationUploading = true;
      this.$apollo
        .mutate({
          mutation: Mutation.uploadImageBase64,
          variables: { payload: base64 }
        })
        .then(({ data }) => {
          const result = data.uploadImageBase64;
          this.mutationUploading = false;
          if (result.success) {
            this.$emit('on-upload', result.url, this.name);
          }
        });
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
    padding-top: 5px;
  }
  &__upload {
    position: absolute;
    top: 20px;
    right: 0px;
    padding: $app--padding-small;
  }

  &__label {
    width: calc(100% - 40px);
    padding: 24px #{$app--padding-standard * 2};
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
