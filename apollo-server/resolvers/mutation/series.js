const { db: context, Series } = require('../../connectors');

module.exports = {
  seriesCreate(_, { series }) {
    const { charactersIds = [], ...args } = series;

    return Series.create({ ...args }).then(async (series) => {
      await series.addCharacters(charactersIds);
      return series.reload();
    });
  },
  seriesUpdate(_, { series }) {
    const { id, charactersIds = [], ...args } = series;

    return Series.findById(id).then(async (series) => {
      return context
        .transaction(async (transaction) => {
          await series.setCharacters(charactersIds, { transaction });

          return Series.update({ ...args }, { where: { id }, transaction });
        })
        .then(() => series.reload());
    });
  }
};
