const Op = require('sequelize').Op;

const { Character } = require('../connectors');

module.exports = {
  characters(_, args) {
    return Character.findAll({ where: args, order: [['name', 'ASC']] });
  },
  character(_, args) {
    const { id } = args;
    return Character.findById(id);
  }
};
