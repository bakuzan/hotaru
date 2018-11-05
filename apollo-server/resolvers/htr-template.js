const Op = require('sequelize').Op;

const { Series } = require('../connectors');

module.exports = {
  rulesSeries(template) {
    const { series = [] } = template.rules;
    if (!series.length) return [];

    return Series.findAll({ where: { id: { [Op.in]: series } } });
  },
  instances(template) {
    console.log(template);
    return template.getHTRInstances();
  }
};
