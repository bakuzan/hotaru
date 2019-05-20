const Op = require('sequelize').Op;

const { db, Character, Series } = require('../connectors');
const Utils = require('../utils');

function buildQueryRules({ rules, search = '' }, options = {}) {
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
    const resolvedSourceRule = !rules.sources.length
      ? sourceRule
      : {
          [Op.or]: [{ seriesId: { [Op.eq]: null } }, sourceRule]
        };
    const resolvedSeriesRule = !rules.series.length
      ? seriesRule
      : {
          [Op.or]: [{ seriesId: { [Op.eq]: null } }, seriesRule]
        };

    filters = {
      [Op.and]: [resolvedSourceRule, resolvedSeriesRule]
    };
  } else {
    filters = {
      ...seriesRule,
      ...sourceRule
    };
  }

  return {
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
    include: options.include ? [Series, ...options.include] : [Series]
  };
}

async function findFromRules(filters, options) {
  const queryRules = buildQueryRules(filters, options);
  return await Character.findAll(queryRules);
}

async function countFromRules(filters, options) {
  const queryRules = buildQueryRules(filters, options);
  return await Character.count(queryRules);
}

module.exports = {
  findFromRules,
  countFromRules
};
