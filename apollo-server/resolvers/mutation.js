const Op = require('sequelize').Op;
const { Character, Series, Tag, Image } = require('../connectors');

const Utils = require('../utils');

module.exports = {
  characterCreate(_, { character }) {
    const { seriesId = null, tags = [], images = [], ...args } = character;
    const {
      newItems: newTags,
      existingItemIds: existingTagIds
    } = Utils.separateArrIntoNewAndExisting(tags);

    return Character.create(
      {
        ...args,
        tags: newTags,
        images
      },
      {
        include: [Character.Tag, Character.Image]
      }
    ).then(async (character) => {
      await character.setSeries(seriesId);
      await character.addTags(existingTagIds);
      return character.reload();
    });
  },
  characterUpdate(_, { character }) {
    const { id, seriesId, tags = [], images = [], ...args } = character;
    const createdAt = Date.now();
    const {
      newItems: newTags,
      existingItemIds: existingTagIds
    } = Utils.separateArrIntoNewAndExisting(tags);
    const {
      newItems: newImages,
      existingItemIds: existingImageIds
    } = Utils.separateArrIntoNewAndExisting(images);

    return Character.findById(id).then(async (character) => {
      await character.setSeries(seriesId);
      await character.setTags(existingTagIds);
      await character.setImages(existingImageIds);

      if (newTags.length) {
        await Tag.bulkCreate(newTags);
        const createdTags = await Tag.findAll({
          where: { createdAt: { [Op.gte]: createdAt } }
        });
        await character.addTags(createdTags);
      }

      if (newImages.length) {
        await Image.bulkCreate(newImages);
        const createdImages = await Image.findAll({
          where: { createdAt: { [Op.gte]: createdAt } }
        });
        await character.addImages(createdImages);
      }

      return Character.update(
        { ...args },
        {
          where: { id }
        }
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
