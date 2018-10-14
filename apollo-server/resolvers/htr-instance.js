const Utils = require('../utils');

module.exports = {
  type(instance) {
    return instance.getHtrTemplate().then((template) => template.type);
  },
  htrTemplate(instance) {
    if (instance.htrTemplate) return instance.htrTemplate;

    return instance.getHtrTemplate();
  },
  characters(instance) {
    if (instance.characters) return instance.characters;

    return instance.getCharacters();
  },
  versus(instance) {
    if (instance.versus) return instance.versus;

    return instance.getVersus();
  },
  createdAt(instance) {
    return Utils.formatDateDisplay(instance.createdAt);
  }
};
