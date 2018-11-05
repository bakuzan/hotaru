const Op = require('sequelize').Op;

const { db, HTRInstance, HTRTemplate } = require('../connectors');
const { HTRTemplateTypes } = require('../constants/enums');

async function checkForActiveLeague(options = {}) {
  const { where = {}, ...otherOptions } = options;

  return await HTRInstance.findOne({
    raw: true,
    attributes: ['htrTemplateId'],
    where: {
      type: db.where(db.col('htrtemplate.type'), {
        [Op.eq]: HTRTemplateTypes.League
      }),
      'settings.isComplete': 'false',
      ...where
    },
    include: [HTRTemplate],
    ...otherOptions
  });
}

module.exports = {
  checkForActiveLeague
};
