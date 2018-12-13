const Op = require('sequelize').Op;

const { Tag } = require('../../connectors');

const character = require('./character');
const series = require('./series');
const versus = require('./versus');
const htrtemplate = require('./htr-template');
const htrinstance = require('./htr-instance');
const htrinstanceleague = require('./htr-instance-league');
const honours = require('./honours');
const rankings = require('./rankings');

module.exports = {
  ...character,
  ...series,
  ...versus,
  ...htrtemplate,
  ...htrinstance,
  ...honours,
  ...htrinstanceleague,
  ...rankings,
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
