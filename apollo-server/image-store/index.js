const imgur = require('imgur');
imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD);

function uploadUrl(payload) {
  imgur
    .uploadUrl(payload, process.env.IMGUR_ALBUM)
    .then(returnImgurUrl(res))
    .catch(returnImgurError(res));
}

function uploadBase64(payload) {
  const [_, base64] = payload.split(',');
  imgur
    .uploadBase64(base64, process.env.IMGUR_ALBUM)
    .then(returnImgurUrl)
    .catch(returnImgurError);
}

function returnImgurUrl(json) {
  console.log('IMGUR > ', json.data);
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
