module.exports = (db, Types) => {
  return db.define('htrinstance', {
    name: {
      type: Types.STRING
    },
    description: {
      type: Types.STRING
    }
  });
};
