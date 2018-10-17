const Op = require('sequelize').Op;

const { HTRTemplate } = require('../../connectors');
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
  }
};
