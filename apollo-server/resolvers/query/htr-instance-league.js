const Op = require('sequelize').Op;

const { db, HTRTemplate, HTRInstance } = require('../../connectors');

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
    return HTRTemplate.findById(id, {
      include: [HTRInstance]
    });
  },
  htrInstanceLeagueById(_, { id }) {
    return HTRInstance.findById(id, {
      include: [Characters]
    });
  }
};
