const Op = require('sequelize').Op;

const {
  db,
  HTRTemplate,
  HTRInstance,
  Versus,
  Character
} = require('../../connectors');
const Utils = require('../../utils');

module.exports = {
  htrInstancesPaged(_, { search, type, paging = {} }) {
    return HTRInstance.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        type: db.where(db.col('htrtemplate.type'), {
          [Op.eq]: type
        })
      },
      order: [['createdAt', 'DESC']],
      limit: paging.size,
      offset: paging.size * paging.page,
      include: [HTRTemplate]
    }).then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: Utils.setHasMoreFlag(result.count, paging)
    }));
  },
  htrInstanceById(_, { id }) {
    return HTRInstance.findByPk(id, {
      include: [
        {
          model: Versus,
          include: [Character],
          separate: true
        }
      ]
    });
  }
};
