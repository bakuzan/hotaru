const Op = require('sequelize').Op;

const { db: context, Versus, Character } = require('../../connectors');
const Constants = require('../../constants');
const Utils = require('../../utils');

module.exports = {
  versusCreateDaily() {
    const createdAt = Date.now() - 1000;

    return context.transaction(async (transaction) => {
      const randomCharacters = await Character.findAll(
        {
          order: context.random(),
          limit: Constants.dailyVersusCharacterCount
        },
        { transaction }
      );

      const versusCharacters = Utils.chunk(randomCharacters, 2).filter(
        (x) => x.length === 2
      );
      // .map((characters) => ({ type: 'Daily', characters }));

      if (!versusCharacters.length) {
        throw Error('Unable to create any character pairs.');
      }

      const versusShells = versusCharacters.map(() => ({ type: 'Daily' }));
      await Versus.bulkCreate(versusShells, {
        transaction
      });

      return await Versus.findAll({
        where: { createdAt: { [Op.gte]: createdAt } },
        transaction
      }).then((createdVersus) => {
        const promises = [];

        createdVersus.forEach(async (v, i) =>
          promises.push(v.setCharacters(versusCharacters[i], { transaction }))
        );

        return Promise.all(promises).then(() =>
          createdVersus.map((created) => created.reload())
        );
      });
    });
  },
  versusVote(_, { versusId, winnerId }) {
    return Versus.update({ winnerId }, { where: { id: versusId } }).then(() =>
      Versus.findById(versusId)
    );
  }
};
