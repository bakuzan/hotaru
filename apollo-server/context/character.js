const Op = require('sequelize').Op;

const { db, Character, Series } = require('../connectors');
const Utils = require('../utils');

function findFromRules({ rules, search = '' }, options = {}) {
  const {
    isIncludeOnlyGender = true,
    isIncludeOnlySource = true,
    isIncludeOnlySeries = true
  } = rules;

  const genderOp = Utils.resolveInOp(isIncludeOnlyGender, rules.genders);
  const sourceOp = Utils.resolveInOp(isIncludeOnlySource, rules.sources);
  const seriesOp = Utils.resolveInOp(isIncludeOnlySeries, rules.series);

  let filters = {};
  const seriesRule = { seriesId: { [seriesOp]: rules.series } };
  const sourceRule = {
    source: db.where(db.col('series.source'), {
      [sourceOp]: rules.sources
    })
  };

  if (!isIncludeOnlySource && !isIncludeOnlySeries) {
    filters = {
      [Op.and]: [
        {
          [Op.or]: [{ seriesId: { [Op.eq]: null } }, sourceRule]
        },
        {
          [Op.or]: [{ seriesId: { [Op.eq]: null } }, seriesRule]
        }
      ]
    };
  } else {
    filters = {
      ...seriesRule,
      ...sourceRule
    };
  }

  return Character.findAll({
    where: {
      name: {
        [Op.like]: `%${search}%`
      },
      gender: {
        [genderOp]: rules.genders
      },
      ...filters
    },
    ...options,
    include: [Series]
  });
}

module.exports = {
  findFromRules
};