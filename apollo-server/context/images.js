const { uploadImage } = require('../image-store');

module.exports = {
  async uploadImage(imageUrl) {
    if (!imageUrl || imageUrl.includes('imgur')) {
      return imageUrl;
    }

    const result = await uploadImage(imageUrl);

    if (!result.success) {
      throw new Error(result.error.message || `Failed to upload: ${imageUrl}`);
    }

    return result.url;
  },
  async uploadImages(imageUrls) {
    const images = [];
    const len = imageUrls.length;

    for (let i = 0; i < len; i++) {
      const imageUrl = imageUrls[i];
      const imgurUrl = await this.uploadImage(imageUrl);
      images.push(imgurUrl);
    }

    return images;
  }
};
