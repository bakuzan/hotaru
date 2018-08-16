module.exports = (db, Types) => {
  return db.define('series', {
    name: { type: Types.STRING }
  });
};
