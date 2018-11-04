const Op = require('sequelize').Op;

const { db, HTRTemplate, HTRInstance } = require('../../connectors');
const Utils = require('../../utils');

module.exports = {
  ongoingHTRInstanceLeagues() {
    // TODO
    // implement
  },
  pastHTRInstanceLeaguesPaged(_, { paging = {} }) {
    return HTRTemplate.findAndCountAll({
      where: {
        type: {
          [Op.eq]: 'League'
        },
        settings: db.where(
          db.fn('JSON_VALUE', db.col('htrInstances.settings'), '$.isComplete'),
          'true'
        )
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
  }
};
