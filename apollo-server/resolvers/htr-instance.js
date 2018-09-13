module.exports = {
  type(instance) {
    return instance.getHtrTemplate().then((template) => template.type);
  },
  characters(instance) {
    return instance.getCharacters();
  },
  versus(instance) {
    return instance.getVersus();
  }
};
