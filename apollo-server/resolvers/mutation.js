const Op = require('sequelize').Op;
const { db: context, Character, Series, Tag, Image } = require('../connectors');

const Gallery = require('../image-store')
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
      return context
        .transaction(async (transaction) => {
          await character.setSeries(seriesId, { transaction });
          await character.setTags(existingTagIds, { transaction });
          await character.setImages(existingImageIds, { transaction });

          if (newTags.length) {
            await Tag.bulkCreate(newTags, { transaction });
            const createdTags = await Tag.findAll({
              where: { createdAt: { [Op.gte]: createdAt } },
              transaction
            });
            await character.addTags(createdTags, { transaction });
          }

          if (newImages.length) {
            await Image.bulkCreate(newImages, { transaction });
            const createdImages = await Image.findAll({
              where: { createdAt: { [Op.gte]: createdAt } },
              transaction
            });
            await character.addImages(createdImages, { transaction });
          }

          return Character.update(
            { ...args },
            {
              where: { id },
              transaction
            }
          );
        })
        .then(() => character.reload());
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
  },
  uploadImageBase64(_, { payload }) {
    return Gallery.uploadBase64(payload);
  },
  uploadImageUrl(_, { payload }) {
    return Gallery.uploadUrl(payload);
  },
};
