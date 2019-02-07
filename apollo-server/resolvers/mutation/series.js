const { db, Series } = require('../../connectors');

module.exports = {
  seriesCreate(_, { series }) {
    const { characterIds = [], ...args } = series;

    return Series.create({ ...args }).then(async (series) => {
      await series.addCharacters(characterIds);
      return series.reload();
    });
  },
  seriesUpdate(_, { series }) {
    const { id, characterIds = [], ...args } = series;

    return Series.findByPk(id).then(async (series) => {
      return db
        .transaction(async (transaction) => {
          await series.setCharacters(characterIds, { transaction });

          return Series.update({ ...args }, { where: { id }, transaction });
        })
        .then(() => series.reload());
    });
  }
};
