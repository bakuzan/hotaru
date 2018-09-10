const Op = require('sequelize').Op;

const { db: context, Versus, Character, Series } = require('../../connectors');
const Constants = require('../../constants');
const Utils = require('../../utils');

module.exports = {
  versusCreateDaily() {
    const createdAt = Date.now() - 1000;

    return context.transaction(async (transaction) => {
      const randomCharacters = await Character.findAll({
        order: context.literal('RANDOM()'),
        limit: Constants.dailyVersusCharacterCount,
        transaction
      });

      const versusCharacters = Utils.chunk(randomCharacters, 2).filter(
        (x) => x.length === 2
      );

      if (!versusCharacters.length) {
        throw Error('Unable to create any character pairs.');
      }

      const versusShells = versusCharacters.map(() => ({ type: 'Daily' }));
      return await Versus.bulkCreate(versusShells, {
        transaction
      }).then(async () => {
        const promises = [];
        const createdVersus = await Versus.findAll({
          where: { createdAt: { [Op.gte]: createdAt } },
          transaction
        });

        createdVersus.forEach((v, i) => {
          const characters = versusCharacters[i];
          promises.push(v.setCharacters(characters, { transaction }));
        });

        return Promise.all(promises).then(() => {
          const versusIds = createdVersus.map((x) => x.id);
          return Versus.findAll({
            where: { id: { [Op.in]: versusIds } },
            transaction
          });
        });
      });
    });
  },
  versusVote(_, { versusId, winnerId }) {
    return Versus.update({ winnerId }, { where: { id: versusId } }).then(() =>
      Versus.findById(versusId)
    );
  },
  versusFromRules(_, { rules }) {
    const {
      isIncludeOnlyGender,
      isIncludeOnlySource,
      isIncludeOnlySeries
    } = rules;

    const genderOp = Utils.resolveInOp(isIncludeOnlyGender);
    const sourceOp = Utils.resolveInOp(isIncludeOnlySource);
    const seriesOp = Utils.resolveInOp(isIncludeOnlySeries);

    const genderRule = {
      [genderOp]: rules.genders
    };

    const sourceRule = {
      source: context.where(context.col('series.source'), {
        [sourceOp]: rules.sources
      })
    };
    const resolvedSourceRule = isIncludeOnlySource
      ? { ...sourceRule }
      : {
          [Op.or]: [{ seriesId: { [Op.eq]: null } }, sourceRule]
        };

    const seriesRule = {
      seriesId: { [seriesOp]: rules.series }
    };
    const resolvedSeriesRule = isIncludeOnlySeries
      ? { ...seriesRule }
      : {
          [Op.or]: [{ seriesId: { [Op.eq]: null } }, seriesRule]
        };

    return context.transaction(async (transaction) => {
      const randomCharacters = await Character.findAll({
        where: {
          gender: genderRule,
          ...resolvedSeriesRule,
          ...resolvedSourceRule
        },
        order: context.literal('RANDOM()'),
        limit: 2,
        include: [Series],
        transaction
      });

      if (randomCharacters.length < 2) {
        throw Error('Unable to create any character pairs.');
      }

      return Versus.create(
        { type: 'Single' },
        {
          transaction
        }
      ).then(async (singleVersus) => {
        await singleVersus.setCharacters(randomCharacters, { transaction });
        return singleVersus.reload({ transaction });
      });
    });
  }
};
