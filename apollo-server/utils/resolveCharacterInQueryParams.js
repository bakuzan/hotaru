const Op = require('sequelize').Op;

const { db } = require('../connectors');
const Utils = require('.');

module.exports = function resolveCharacterInQueryParams({ genders, sources }) {
  return {
    ...Utils.ifArrayThenIn(genders, {
      gender: {
        [Op.in]: genders
      }
    }),
    ...Utils.ifArrayThenIn(sources, {
      source: db.where(db.col('series.source'), {
        [Op.in]: sources
      })
    })
  };
};
