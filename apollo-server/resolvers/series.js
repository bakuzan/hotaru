module.exports = {
  characters(series, args) {
    return series.getCharacters({ where: args });
  }
};
