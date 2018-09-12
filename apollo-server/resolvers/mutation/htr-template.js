const { HTRTemplate } = require('../../connectors');

module.exports = {
  htrTemplateCreate(_, { template }) {
    return HTRTemplate.create({ ...template });
  },
  htrTemplateUpdate(_, { template }) {
    const { id, ...args } = template;
    return HTRTemplate.update({ ...args }, { where: { id } }).then(() =>
      HTRTemplate.findById(id)
    );
  }
};
