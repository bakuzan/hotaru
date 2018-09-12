const { HTRInstance } = require('../../connectors');

module.exports = {
  htrTemplateCreate(_, { template }) {
    return HTRInstance.create({ ...template });
  },
  htrTemplateUpdate(_, { template }) {
    const { id, ...args } = template;
    return HTRInstance.update({ ...args }, { where: { id } }).then(() =>
      HTRInstance.findById(id)
    );
  }
};
