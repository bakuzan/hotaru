module.exports = (db, Types) => {
  return db.define('htrInstance', {
    name: {
      type: Types.STRING,
      allowNull: false
    },
    description: {
      type: Types.STRING,
      allowNull: false
    },
    settings: {
      type: Types.JSON,
      allowNull: false
    }
  });
};

// Example settings structure
// {
//   // copy of rules, with option to remove some e.g original= series[2,3,4], new= series[4]
//   rules: {},
//  // list only
//   order: enum,
//   // list = any number from 3 -> 10
//   // bracket = one of [8, 16, 32, 64], will create largest valid bracket upto limit
//   limit: 0,
//   //bracket only = enum BracketStatus => InProgress/Complete
//   status: 'InProgress',
//   // bracket layout of versus
//   layout: [[1,2,3]]
// }
