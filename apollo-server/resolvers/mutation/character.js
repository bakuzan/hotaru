const Op = require('sequelize').Op;
const {
  db: context,
  Character,
  Tag,
  Image,
  CharacterOfTheDay
} = require('../../connectors');

const Utils = require('../../utils');

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
            await Tag.bulkCreate(newTags, { transaction }).then(() =>
              Tag.findAll({
                where: { createdAt: { [Op.gte]: createdAt } },
                transaction
              }).then((createdTags) =>
                character.addTags(createdTags, { transaction })
              )
            );
          }

          if (newImages.length) {
            await Image.bulkCreate(newImages, { transaction }).then(() =>
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

    return context.transaction(async (transaction) => {
      const cotd = await CharacterOfTheDay.findOne({
        where: { createdAt: { [Op.gte]: todayMidnight } },
        transaction
      });

      if (cotd) return cotd.getCharacter({ transaction });

      return Character.findOne({
        order: context.literal('RANDOM()'),
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
