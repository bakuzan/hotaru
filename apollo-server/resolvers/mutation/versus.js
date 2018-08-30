const Op = require('sequelize').Op;

const { db: context, Versus, Character } = require('../../connectors');
const Constants = require('../../constants');
const Utils = require('../../utils');

module.exports = {
  versusCreateDaily() {
    const createdAt = Date.now() - 1000;

    return context.transaction(async (transaction) => {
      const randomCharacters = await context.query(
        `SELECT id FROM characters 
         WHERE id IN (
          SELECT id FROM characters 
          ORDER BY RANDOM() 
          LIMIT ${Constants.dailyVersusCharacterCount}
        )`,
        { type: context.QueryTypes.SELECT, transaction }
      );

      const versusCharacters = Utils.chunk(randomCharacters, 2).filter(
        (x) => x.length === 2
      );
      // .map((characters) => ({ type: 'Daily', characters }));

      if (!versusCharacters.length) {
        throw Error('Unable to create any character pairs.');
      }

      const versusShells = versusCharacters.map(() => ({ type: 'Daily' }));
      return await Versus.bulkCreate(versusShells, {
        transaction
      }).then(
        async () =>
          await Versus.findAll({
            where: { createdAt: { [Op.gte]: createdAt } },
            transaction
          }).then((createdVersus) => {
            const promises = [];

            createdVersus.forEach(async (v, i) => {
              const characterIds = versusCharacters[i];
              promises.push(v.setCharacters(characterIds, { transaction }));
            });

            return Promise.all(promises).then(() =>
              createdVersus.map((created) => created.reload())
            );
          })
      );
    });
  },
  versusVote(_, { versusId, winnerId }) {
    return Versus.update({ winnerId }, { where: { id: versusId } }).then(() =>
      Versus.findById(versusId)
    );
  }
};
