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
      'settings.isComplete': {
        [Op.eq]: false
      },
      ...where
    },
    include: [HTRTemplate],
    ...otherOptions
  });
}

async function getInstanceAndCheckIfLeague({ id, transaction }) {
  const league = await HTRInstance.findByPk(id, {
    attributes: ['id', 'name', 'settings'],
    include: [{ model: HTRTemplate, attributes: ['type'] }],
    transaction
  });

  if (!league) {
    throw Error('No instance found.');
  }

  const { htrTemplate } = league.dataValues;
  if (htrTemplate && htrTemplate.dataValues.type !== HTRTemplateTypes.League) {
    throw Error('Invalid instance type.');
  }

  return league;
}

module.exports = {
  checkForActiveLeague,
  getInstanceAndCheckIfLeague
};
