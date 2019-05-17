const Op = require('sequelize').Op;

const { Tag } = require('../../connectors');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const htrtemplate = require('./htrTemplate');
const htrinstance = require('./htrInstance');
const htrinstanceleague = require('./htrInstanceLeague');
const honours = require('./honours');
const rankings = require('./rankings');
const gauntlet = require('./gauntlet');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...htrtemplate,
  ...htrinstance,
  ...honours,
  ...htrinstanceleague,
  ...rankings,
  ...gauntlet,
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
  }
};
