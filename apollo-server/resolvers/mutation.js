const { Character, Series, Tag } = require('../connectors');

module.exports = {
  characterCreate(_, { character }) {
    const { seriesId = null, tagIds = [], ...args } = character;

    return Character.create({
      ...args
    }).then((character) => {
      character.setSeries(seriesId);
      character.setTags(tagIds);
      return character.reload({
        includes: [{ model: Series }, { model: Tag }]
      });
    });
  },
  characterUpdate(_, { character }) {
    const { id, seriesId, tagIds = [], ...args } = character;

    return Character.update({ ...args }, { where: { id } }).then(() =>
      Character.findById(id).then((character) => {
        character.setSeries(seriesId);
        character.setTags(tagIds);
        return character.reload({
          includes: [{ model: Series }, { model: Tag }]
        });
      })
    );
  },
  seriesCreate(_, { series }) {
    return Series.create({ ...series }).then((series) => series);
  },
  seriesUpdate(_, { series }) {
    const { id, ...args } = series;
    return Series.update({ ...args }, { where: { id } }).then(() =>
      Series.findById(id)
    );
  },
  tagCreate(_, { tag }) {
    return Tag.create({ ...tag }).then((tag) => tag);
  }
};
