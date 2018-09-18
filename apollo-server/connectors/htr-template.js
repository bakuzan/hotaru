const { HTRTemplateType } = require('../constants/enums');

module.exports = (db, Types) => {
  return db.define('htrTemplate', {
    name: {
      type: Types.STRING,
      allowNull: false
    },
    type: {
      type: Types.ENUM,
      values: [...HTRTemplateType]
    },
    rules: {
      type: Types.JSON,
      allowNull: false
    }
  });
};

// Example rules structure
// {
//   series: [],
//   sources: [],
//   genders: []
// }
