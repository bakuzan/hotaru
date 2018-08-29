const Gallery = require('../../image-store');

module.exports = {
  uploadImageBase64(_, { payload }) {
    return Gallery.uploadBase64(payload);
  },
  uploadImageUrl(_, { payload }) {
    return Gallery.uploadUrl(payload);
  }
};
