const { HTRTemplateType } = require('../constants/enums');

module.exports = (db, Types) => {
  return db.define('htrinstance', {
    name: {
      type: Types.STRING
    },
    description: {
      type: Types.STRING
    },
    settings: {
      type: Types.JSON
    }
  });
};

// Example settings structure
const settings = {
  // list only = copy of rules, with option to remove some e.g original= series[2,3,4], new= series[4]
  rules: {},
  // list = any number from 3 -> 10
  // bracket = one of [8, 16, 32, 64], will create largest valid bracket upto limit
  limit: 0,
  //bracket only = enum BracketStatus => InProgress/Complete
  status: 'InProgress'
};
console.log(settings);
