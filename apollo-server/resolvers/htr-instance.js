const Utils = require('../utils');

module.exports = {
  type(instance) {
    return instance.getHtrTemplate().then((template) => template.type);
  },
  htrTemplate(instance) {
    return instance.getHtrTemplate();
  },
  characters(instance) {
    return instance.getCharacters();
  },
  versus(instance) {
    return instance.getVersus();
  },
  createdAt(instance) {
    return Utils.formatDateDisplay(instance.createdAt);
  }
};
