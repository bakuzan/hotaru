const Op = require('sequelize').Op;

const {
  db,
  HTRTemplate,
  HTRInstance,
  Versus,
  Character
} = require('../../connectors');

const { HTRTemplateTypes, VersusTypes } = require('../../constants/enums');
const Utils = require('../../utils');
const generateLeagueMatches = require('../../utils/league-matches');

module.exports = {
  htrInstanceLeagueCreate(_, __, context) {
    return db.transaction(async (transaction) => {
      const createdAt = Date.now();

      const activeInstance = await context.HTRInstanceLeague.checkForActiveLeague(
        { transaction }
      );

      if (activeInstance) {
        throw Error(
          'At least one league is still currently active in the latest season.'
        );
      }

      const seasonCount = await HTRTemplate.count({
        where: {
          type: {
            [Op.eq]: HTRTemplateTypes.League
          }
        },
        transaction
      });

      const seasonNumber = seasonCount + 1;
      const seasonName = `Season ${seasonNumber}`;
      const newTemplate = {
        name: seasonName,
        type: HTRTemplateTypes.League,
        rules: ''
      };

      const template = await HTRTemplate.create(newTemplate, { transaction });

      const allCharacters = await Character.findAll({
        raw: true,
        attributes: ['id'],
        order: db.literal('RANDOM()'),
        transaction
      });

      const chunkedCharacters = Utils.chunk(allCharacters, 20);

      const newInstances = chunkedCharacters.map((cArr, i) => {
        const n = cArr.length;
        const leagueNumber = i + 1;
        const seasonOrdinal = Utils.getOrdinalNum(seasonNumber);
        const leagueOrdinal = Utils.getOrdinalNum(leagueNumber);

        return {
          name: `League ${leagueNumber}`,
          description: `The ${leagueNumber}${leagueOrdinal} league of the ${seasonNumber}${seasonOrdinal} season.`,
          settings: {
            isComplete: false,
            limit: cArr.map((_, i) => n - 1 - i).reduce((p, c) => p + c, 0),
            layout: generateLeagueMatches(cArr)
          },
          htrTemplateId: template.id
        };
      });

      await HTRInstance.bulkCreate(newInstances, { transaction });
      const createdInstances = await HTRInstance.findAll({
        where: { createdAt: { [Op.gte]: createdAt } },
        transaction
      });

      const associations = [];
      createdInstances.map((instance, i) => {
        const chara = chunkedCharacters[i];
        const characterIds = chara.map((x) => x.id);
        associations.push(
          instance.setCharacters(characterIds, { transaction })
        );
      });

      return Promise.all(associations).then(() => template);
    });
  },
  htrInstanceLeagueVersusCreate(_, { id }) {
    return db.transaction(async (transaction) => {
      const league = await HTRInstance.findById(id, {
        raw: true,
        attributes: ['id', 'settings'],
        include: [{ model: HTRTemplate, attributes: ['type'] }],
        transaction
      });

      if (!league) {
        throw Error('No instance found.');
      }

      if (league['htrTemplate.type'] !== HTRTemplateTypes.League) {
        throw Error('Invalid instance type.');
      }

      const matchCounts = await Versus.findAll({
        raw: true,
        where: { htrInstanceId: { [Op.eq]: id } },
        attributes: [
          'id',
          [sequelize.fn('COUNT', db.col('id')), 'total'],
          [sequelize.fn('COUNT', db.col('winnerId')), 'completed']
        ],
        transaction
      });

      if (matchCounts.total !== matchCounts.completed) {
        throw Error('Some matches are still ongoing.');
      }

      if (matchCounts.total === league.settings.limit) {
        throw Error('Match count reached.');
      }

      const layout = league.settings.layout;
      const matchSet = layout.find((x, i) => {
        const xCount = x.length;
        return xCount * i + xCount > matchCounts.total;
      });

      const newVersus = matchSet.map((x) => ({
        type: VersusTypes.League
      }));

      // TODO
      // Create versus from them
      // Update layout
      // Return new versus
      throw Error('Not Finished.');
    });
  }
};
