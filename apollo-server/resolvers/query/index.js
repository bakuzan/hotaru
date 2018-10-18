const Op = require('sequelize').Op;

const { Tag, Ranking, Character } = require('../../connectors');
const Utils = require('../../utils');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const htrtemplate = require('./htr-template');
const htrinstance = require('./htr-instance');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...htrtemplate,
  ...htrinstance,
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
  },
  async honours(_, __, context) {
    const weekAgo = Utils.getDaysAgoX(7);
    const monthAgo = Utils.getDaysAgoX(30);

    const [mostWinsInLast7] = await context.Honours.mostWinsForDate(weekAgo);
    const [mostWinsInLast30] = await context.Honours.mostWinsForDate(monthAgo);

    return {
      mostWinsInLast7,
      mostWinsInLast30
    };
  }
};
