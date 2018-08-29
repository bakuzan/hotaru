module.exports = {
  series(character) {
    return character.getSeries();
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
