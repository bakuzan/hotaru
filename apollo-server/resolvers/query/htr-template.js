const Op = require('sequelize').Op;

const { db, HTRTemplate, HTRInstance } = require('../../connectors');
const Utils = require('../../utils');

module.exports = {
  htrTemplatesPaged(_, { search, type, paging = {} }) {
    return HTRTemplate.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        type: { [Op.eq]: type }
      },
      order: [['name', 'ASC']],
      limit: paging.size,
      offset: paging.size * paging.page
    }).then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: Utils.setHasMoreFlag(result.count, paging)
    }));
  },
  htrTemplates(_, { search, type }) {
    return HTRTemplate.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        type: { [Op.eq]: type }
      },
      order: [['name', 'ASC']]
    });
  },
  htrTemplateById(_, { id }) {
    return HTRTemplate.findById(id);
  },
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
      order: [['name', 'ASC']],
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
    return HTRInstance.findById(id);
  }
};
