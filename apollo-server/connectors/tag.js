module.exports = (db, Types) => {
  return db.define('tag', {
    name: {
      type: Types.STRING,
      unique: true,
      allowNull: false
    }
  });
};
