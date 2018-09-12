const Op = require('sequelize').Op;

const { HTRTemplate } = require('../../connectors');

module.exports = {
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
