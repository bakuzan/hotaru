const Op = require('sequelize').Op;

const { Tag } = require('../../connectors');

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
    // TODO
    // Query rankings topten
  }
};
