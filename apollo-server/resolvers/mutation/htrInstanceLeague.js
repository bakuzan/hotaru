const Op = require('sequelize').Op;

const {
  db,
  HTRTemplate,
  HTRInstance,
  Versus,
  Character
} = require('../../connectors');
const SQL = require('../../db-scripts');
const { HTRTemplateTypes, VersusTypes } = require('../../constants/enums');
const Utils = require('../../utils');
const generateLeagueMatches = require('../../utils/leagueMatches');

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
          description: `The ${leagueOrdinal} league of the ${seasonOrdinal} season.`,
          settings: {
            isComplete: false,
            limit: n,
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
  htrInstanceLeagueVersusCreate(_, { id }, context) {
    return db.transaction(async (transaction) => {
      const league = await context.HTRInstanceLeague.getInstanceAndCheckIfLeague(
        { id, transaction }
      );

      const [matchCounts] = await Versus.findAll({
        raw: true,
        where: { htrInstanceId: { [Op.eq]: id } },
        attributes: [
          [db.fn('COUNT', db.col('id')), 'total'],
          [db.fn('COUNT', db.col('winnerId')), 'completed']
        ],
        transaction
      });

      if (!matchCounts) {
        throw Error('Unable to check match progress.');
      }

      if (matchCounts.total !== matchCounts.completed) {
        throw Error('Some matches are still ongoing.');
      }

      const { settings } = league.dataValues;
      const { layout, limit } = settings;
      if (matchCounts.total === layout.length) {
        throw Error('Match count reached.');
      }

      const half = limit / 2;
      const offset = matchCounts.total;
      const matchSet = layout.slice(offset, offset + half);
      if (!matchSet.length) {
        throw Error('Unable to find next match set.');
      }

      const newVersus = await context.Versus.createForCharacters(
        VersusTypes.League,
        matchSet.reduce((p, c) => [...p, ...c], []),
        { transaction }
      );

      await league.addVersus(newVersus, { transaction });
      return newVersus;
    });
  },
  htrInstanceLeagueVersusVote(
    _,
    { htrInstanceId, versusId, winnerId },
    context
  ) {
    return db.transaction(async (transaction) => {
      const league = await context.HTRInstanceLeague.getInstanceAndCheckIfLeague(
        { id: htrInstanceId, transaction }
      );

      await Versus.update(
        { winnerId },
        { where: { id: versusId, htrInstanceId }, transaction }
      );

      const completedMatches = await Versus.count({
        where: { htrInstanceId, winnerId: { [Op.ne]: null } },
        transaction
      });

      const leagueData = league.dataValues;
      const currentSettings = leagueData.settings;
      const isComplete = completedMatches === currentSettings.layout.length;
      const settings = { ...currentSettings, isComplete };

      if (isComplete) {
        await HTRInstance.update(
          { settings },
          { where: { id: htrInstanceId }, transaction }
        );

        await db.query(
          'UPDATE htrTemplates SET updatedAt = :updatedAt WHERE id = :id',
          {
            type: db.QueryTypes.UPDATE,
            replacements: {
              id: leagueData.htrTemplateId,
              updatedAt: new Date()
            },
            transaction
          }
        );
      }

      const leagueTable = await db.query(SQL['get_league_table'], {
        type: db.QueryTypes.SELECT,
        replacements: { leagueId: htrInstanceId },
        transaction
      });

      return {
        ...leagueData,
        settings,
        leagueTable
      };
    });
  }
};
