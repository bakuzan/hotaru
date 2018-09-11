const { HTRInstance } = require('../../connectors');

module.exports = {
  htrTemplateCreate(_, { instance }) {
    return HTRInstance.create({ ...instance });
  },
  htrTemplateUpdate(_, { instance }) {
    const { id, ...args } = instance;
    return HTRInstance.update({ ...args }, { where: { id } }).then(() =>
      HTRInstance.findById(id)
    );
  }
};
