module.exports = {
  series(character) {
    return character.getSeries();
  },
  seriesId(character) {
    return character.getSeries().then((series) => (series ? series.id : null));
  }
};
