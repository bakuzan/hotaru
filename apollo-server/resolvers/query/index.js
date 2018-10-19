const Op = require('sequelize').Op;

const { Tag, Ranking, Character } = require('../../connectors');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const htrtemplate = require('./htr-template');
const htrinstance = require('./htr-instance');
const honours = require('./honours');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...htrtemplate,
  ...htrinstance,
  ...honours,
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
      limit: 10,
      include: [Character]
    });
  }
};
