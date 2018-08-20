module.exports = (db, Types) => {
  return db.define('image', {
    url: { type: Types.STRING }
  });
};
