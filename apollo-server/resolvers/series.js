module.exports = {
  characters(series, args) {
    if (series.characters) return series.characters;

    return series.getCharacters({ where: args });
  }
};
