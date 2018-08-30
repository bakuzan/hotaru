module.exports = (db, Types) => {
  return db.define('ranking', {
    total: {
      type: Types.INTEGER
    },
    wins: {
      type: Types.INTEGER
    },
    rank: {
      type: Types.INTEGER
    }
  });
};
