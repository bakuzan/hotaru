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
  async uploadImages(imageEntities) {
    const images = [];
    const len = imageEntities.length;

    for (let i = 0; i < len; i++) {
      const imageUrl = imageEntities[i].url;
      const url = await this.uploadImage(imageUrl);
      images.push({ url });
    }

    return images;
  }
};
