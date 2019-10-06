const Op = require('sequelize').Op;
const {
  db,
  Character,
  Tag,
  Image,
  CharacterOfTheDay
} = require('../../connectors');

const Utils = require('../../utils');

module.exports = {
  async characterCreate(_, { character }, context) {
    const { seriesId = null, tags = [], images = [], ...args } = character;
    const {
      newItems: newTags,
      existingItemIds: existingTagIds
    } = Utils.separateArrIntoNewAndExisting(tags);

    args.displayImage = await context.Images.uploadImage(args.displayImage);
    const newImages = await context.Images.uploadImages(images);

    return Character.create(
      {
        ...args,
        tags: newTags,
        images: newImages
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
  async characterUpdate(_, { character }, context) {
    const { id, seriesId, tags = [], images, ...args } = character;
    const createdAt = Date.now();
    const {
      newItems: newTags,
      existingItemIds: existingTagIds
    } = Utils.separateArrIntoNewAndExisting(tags);
    const {
      newItems: newImages,
      existingItemIds: existingImageIds
    } = Utils.separateArrIntoNewAndExisting(images);

    return Character.findByPk(id).then(async (character) => {
      return db
        .transaction(async (transaction) => {
          await character.setSeries(seriesId, { transaction });
          await character.setTags(existingTagIds, { transaction });

          if (images) {
            await character.setImages(existingImageIds, { transaction });
          }

          if (newTags.length) {
            await Tag.bulkCreate(newTags, { transaction }).then(() =>
              Tag.findAll({
                where: { createdAt: { [Op.gte]: createdAt } },
                transaction
              }).then((createdTags) =>
                character.addTags(createdTags, { transaction })
              )
            );
          }

          const newImgurImages = await context.Images.uploadImages(newImages);

          if (newImgurImages.length) {
            await Image.bulkCreate(newImgurImages, { transaction }).then(() =>
              Image.findAll({
                where: { createdAt: { [Op.gte]: createdAt } },
                transaction
              }).then((createdImages) =>
                character.addImages(createdImages, { transaction })
              )
            );
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
  characterOfTheDay(_, { onDate }) {
    const todayMidnight = new Date(onDate || new Date());
    todayMidnight.setUTCHours(0, 0, 0, 0);

    return db.transaction(async (transaction) => {
      const cotd = await CharacterOfTheDay.findOne({
        where: { createdAt: { [Op.gte]: todayMidnight } },
        transaction
      });

      if (cotd) return cotd.getCharacter({ transaction });

      return Character.findOne({
        order: db.literal('RANDOM()'),
        transaction
      })
        .then((character) =>
          CharacterOfTheDay.create(
            { characterId: character.id },
            { transaction }
          )
        )
        .then((newCotd) => newCotd.getCharacter({ transaction }));
    });
  }
};
