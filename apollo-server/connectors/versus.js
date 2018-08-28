const { VersusType } = require('../constants/enums');

module.exports = (db, Types) => {
  return db.define('versus', {
    type: {
      type: Types.ENUM,
      values: [...VersusType]
    }
  });
};
