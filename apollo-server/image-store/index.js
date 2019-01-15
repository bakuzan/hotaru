const imgur = require('imgur');
imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD);

function uploadUrl(payload) {
  return imgur
    .uploadUrl(payload, process.env.IMGUR_ALBUM)
    .then(returnImgurUrl)
    .catch(returnImgurError);
}

function uploadBase64(payload) {
  const [_, base64] = payload.split(',');
  return imgur
    .uploadBase64(base64, process.env.IMGUR_ALBUM)
    .then(returnImgurUrl)
    .catch(returnImgurError);
}

function returnImgurUrl(json) {
  return {
    success: true,
    url: json.data.link
  };
}

function returnImgurError(error) {
  console.error(error.message);
  throw error;
}

module.exports = {
  uploadUrl,
  uploadBase64
};
