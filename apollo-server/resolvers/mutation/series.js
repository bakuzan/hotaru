const { db, Series } = require('../../connectors');

module.exports = {
  async seriesCreate(_, { series }, context) {
    const { characterIds = [], ...args } = series;

    args.displayImage = await context.Images.uploadImage(args.displayImage);

    return Series.create({ ...args }).then(async (series) => {
      await series.addCharacters(characterIds);
      return series.reload();
    });
  },
  async seriesUpdate(_, { series }, context) {
    const { id, characterIds = [], ...args } = series;

    return Series.findByPk(id).then(async (series) => {
      return db
        .transaction(async (transaction) => {
          await series.setCharacters(characterIds, { transaction });

          args.displayImage = await context.Images.uploadImage(
            args.displayImage
          );

          return Series.update({ ...args }, { where: { id }, transaction });
        })
        .then(() => series.reload());
    });
  }
};
