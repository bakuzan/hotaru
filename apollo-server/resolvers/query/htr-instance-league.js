const Op = require('sequelize').Op;

const {
  db,
  HTRTemplate,
  HTRInstance,
  Character,
  Versus
} = require('../../connectors');
const SQL = require('../../db-scripts');
const { HTRTemplateTypes } = require('../../constants/enums');
const Utils = require('../../utils');

module.exports = {
  async ongoingHTRInstanceLeagues(_, __, context) {
    const activeInstance = await context.HTRInstanceLeague.checkForActiveLeague();

    if (!activeInstance) {
      console.log('No ongoing instances.', activeInstance);
      return null;
    }

    return await HTRTemplate.findById(activeInstance.htrTemplateId, {
      include: [HTRInstance]
    });
  },
  async pastHTRInstanceLeaguesPaged(_, { paging = {} }) {
    const activeInstances = await HTRInstance.findAll({
      raw: true,
      attributes: ['htrTemplateId'],
      where: {
        type: db.where(db.col('htrtemplate.type'), {
          [Op.eq]: HTRTemplateTypes.League
        }),
        'settings.isComplete': {
          [Op.eq]: false
        }
      },
      include: [HTRTemplate]
    });

    const activeTemplateIds = activeInstances.map((x) => x.htrTemplateId);
    return await HTRTemplate.findAndCountAll({
      where: {
        id: {
          [Op.notIn]: activeTemplateIds
        },
        type: {
          [Op.eq]: HTRTemplateTypes.League
        }
      },
      order: [['createdAt', 'DESC']],
      limit: paging.size,
      offset: paging.size * paging.page,
      include: [HTRInstance]
    }).then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: Utils.setHasMoreFlag(result.count, paging)
    }));
  },
  htrTemplateSeasonById(_, { id }) {
    return HTRTemplate.findById(id);
  },
  async htrInstanceLeagueById(_, { id, page = 0 }) {
    const league = await HTRInstance.findById(id);

    if (!league) {
      return null;
    }

    const leagueData = league.dataValues;
    const { limit } = leagueData.settings;
    const pageSize = Number(limit) / 2;

    const matchesResult = await Versus.findAndCountAll({
      where: { htrInstanceId: id },
      order: [['createdAt', 'desc']],
      limit: pageSize,
      offset: pageSize * page,
      distinct: true,
      include: [Character]
    });

    const leagueTable = await db.query(SQL['get_league_table'], {
      type: db.QueryTypes.SELECT,
      replacements: { leagueId: id }
    });

    return {
      ...leagueData,
      matches: {
        nodes: matchesResult.rows,
        total: matchesResult.count,
        hasMore: Utils.setHasMoreFlag(matchesResult.count, {
          size: pageSize,
          page
        })
      },
      leagueTable
    };
  }
};
