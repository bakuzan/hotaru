const { HTRTemplateType } = require('../constants/enums');

module.exports = (db, Types) => {
  return db.define('htrtemplate', {
    name: {
      type: Types.STRING
    },
    type: {
      type: Types.ENUM,
      values: [...HTRTemplateType]
    },
    rules: {
      type: Types.JSON
    }
  });
};

// Example rules structure
const rules = {
  // includes only!
  series: [],
  sources: [],
  genders: [],
  order: [['attr', 'direction']]
};
console.log(rules);
