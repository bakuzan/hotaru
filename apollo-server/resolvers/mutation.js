const { Character, Series, Tag, Image } = require('../connectors');

module.exports = {
  characterCreate(_, { character }) {
    const { series = null, tags = [], images = [], ...args } = character;

    return Character.create(
      {
        ...args,
        series,
        tags,
        images
      },
      {
        include: [Series, Tag, Image]
      }
    ).then((character) => character);
  },
  characterUpdate(_, { character }) {
    const { id, series, tags = [], images = [], ...args } = character;

    return Character.update(
      { ...args, series, tags, images },
      { where: { id }, include: [Series, Tag, Image] }
    ).then(() => Character.findById(id).then((character) => character));
  },
  seriesCreate(_, { series }) {
    const { characters = [], ...args } = series;

    return Series.create(
      { ...args, characters },
      { include: [Character] }
    ).then((series) => series);
  },
  seriesUpdate(_, { series }) {
    const { id, characters = [], ...args } = series;

    return Series.update(
      { ...args, characters },
      { where: { id }, include: [Character] }
    ).then(() => Series.findById(id));
  },
  tagCreate(_, { tag }) {
    return Tag.create({ ...tag }).then((tag) => tag);
  }
};
