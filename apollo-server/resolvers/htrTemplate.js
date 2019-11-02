const Op = require('sequelize').Op;

const { Series } = require('../connectors');
const Utils = require('../utils');

module.exports = {
  rulesSeries(template) {
    const { series = [] } = template.rules;
    if (!series.length) {
      return [];
    }

    return Series.findAll({ where: { id: { [Op.in]: series } } });
  },
  instances(template) {
    if (template.htrInstances) {
      return template.htrInstances;
    }

    return template.getHtrInstances();
  },
  createdAt(instance) {
    const datetime = Utils.formatDateDisplay(instance.createdAt);
    const index = datetime.indexOf(' @');
    if (index !== -1) {
      return datetime.slice(0, index);
    } else {
      return datetime;
    }
  },
  updatedAt(instance) {
    const datetime = Utils.formatDateDisplay(instance.updatedAt);
    const index = datetime.indexOf(' @');
    if (index !== -1) {
      return datetime.slice(0, index);
    } else {
      return datetime;
    }
  }
};
