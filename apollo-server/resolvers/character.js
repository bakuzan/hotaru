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
  },
  ranking(character) {
    if (character.ranking) return character.ranking;

    return character.getRanking();
  }
};
