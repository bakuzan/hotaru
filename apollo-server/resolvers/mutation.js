const { Character, Series, Tag, Image } = require('../connectors');

const Utils = require('../utils');

module.exports = {
  characterCreate(_, { character }) {
    const { seriesId = null, tags = [], images = [], ...args } = character;
    const {
      newItems: newTags,
      existingItems: existingTags
    } = Utils.separateArrIntoNewAndExisting(tags);

    return Character.create(
      {
        ...args,
        tags: newTags,
        images
      },
      {
        include: [Tag, Image]
      }
    ).then((character) => {
      character.setSeries(seriesId);
      character.addTags(existingTags);
      return character.reload();
    });
  },
  characterUpdate(_, { character }) {
    const { id, seriesId, tags = [], images = [], ...args } = character;
    const {
      newItems: newTags,
      existingItems: existingTags
    } = Utils.separateArrIntoNewAndExisting(tags);
    const {
      newItems: newImages,
      existingItems: existingImages
    } = Utils.separateArrIntoNewAndExisting(images);

    return Character.findById(id).then((character) => {
      character.setSeries(seriesId);
      character.setTags(existingTags);
      character.setImages(existingImages);

      return Character.update(
        { ...args, tags: newTags, images: newImages },
        { where: { id }, include: [Tag, Image] }
      ).then(() => character.reload());
    });
  },
  seriesCreate(_, { series }) {
    const { characters = [], ...args } = series;

    return Series.create({ ...args }).then((series) => {
      series.addCharacters(characters);
      return series.reload();
    });
  },
  seriesUpdate(_, { series }) {
    const { id, characters = [], ...args } = series;

    return Series.findById(id).then((series) => {
      series.setCharacters(characters);

      return Series.update({ ...args }, { where: { id } }).then(() =>
        series.reload()
      );
    });
  },
  tagCreate(_, { tag }) {
    return Tag.create({ ...tag }).then((tag) => tag);
  }
};
