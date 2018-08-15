const { GenderType } = require('../constants/enums');

module.exports = (db, Types) => {
  return db.define('character', {
    name: { type: Types.STRING },
    gender: {
      type: Types.ENUM,
      values: [...GenderType]
    },
    displayImage: {
      type: Types.STRING
    }
  });
};
