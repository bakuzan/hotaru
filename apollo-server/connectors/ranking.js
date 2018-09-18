module.exports = (db, Types) => {
  return db.define('ranking', {
    total: {
      type: Types.INTEGER,
      allowNull: false
    },
    wins: {
      type: Types.INTEGER,
      allowNull: false
    },
    rank: {
      type: Types.INTEGER,
      unique: true,
      allowNull: false
    }
  });
};
