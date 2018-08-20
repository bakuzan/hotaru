module.exports = {
  series(character) {
    return character.getSeries();
  },
  seriesId(character) {
    return character.getSeries().then((series) => (series ? series.id : null));
  },
  tags(character) {
    return character.getTags();
  },
  tagIds(character) {
    return character.getTags().then((tags) => tags.map((x) => x.id));
  },
  images(character) {
    return character.getImages();
  }
};
