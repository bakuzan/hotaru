const Op = require('sequelize').Op;

const { db: context, HTRTemplate, HTRInstance } = require('../../connectors');

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
  },
  htrInstances(_, { search, type }) {
    return HTRInstance.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        },
        type: context.where(context.col('htrtemplate.type'), {
          [Op.eq]: type
        })
      },
      order: [['name', 'ASC']],
      include: [HTRTemplate]
    });
  },
  htrInstanceById(_, { id }) {
    return HTRInstance.findById(id);
  }
};
