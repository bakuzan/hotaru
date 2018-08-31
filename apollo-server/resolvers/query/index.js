const Op = require('sequelize').Op;

const { db: context, Tag, Ranking } = require('../../connectors');
const SQL = require('../../db-scripts');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');

module.exports = {
  ...character,
  ...series,
  ...versus,
  tags(_, { search = '', ...args }) {
    return Tag.findAll({
      where: {
        ...args,
        name: {
          [Op.like]: `%${search}%`
        }
      },
      order: [['name', 'ASC']]
    });
  },
  rankingsTopTen() {
    return Ranking.findAll({
      order: [['rank', 'asc']],
      limit: 10
    });
  },
  populateRankings() {
    console.log(SQL);
    return context
      .query(SQL['delete_from_rankings'])
      .then(() => context.query(SQL['drop_ranking_temp']))
      .then(() => context.query(SQL['generate_rankings']))
      .then(() => context.query(SQL['populate_rankings']))
      .then(() => context.query(SQL['drop_ranking_temp']))
      .then(() => ({ success: true, message: '' }))
      .catch((error) => ({ success: false, message: error.message }));
  }
};
