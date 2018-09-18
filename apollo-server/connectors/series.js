const { SourceType } = require('../constants/enums');

module.exports = (db, Types) => {
  return db.define('series', {
    name: { type: Types.STRING, allowNull: false },
    source: {
      type: Types.ENUM,
      values: [...SourceType]
    },
    displayImage: {
      type: Types.STRING,
      allowNull: true
    }
  });
};
