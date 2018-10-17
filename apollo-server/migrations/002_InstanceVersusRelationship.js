const SQL = require('../db-scripts');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('versus', 'htrInstanceId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'htrInstances',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
      .then(() =>
        queryInterface.sequelize.query(
          SQL['move_htrInstanceIds_into_versus_table']
        )
      )
      .then(() =>
        queryInterface.removeIndex(
          'htrInstanceVersus',
          'htr_instance_versus_htr_instance_id'
        )
      )
      .then(() => queryInterface.dropTable('HTRInstanceVersus'));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('versus', 'htrInstanceId')
      .then(() =>
        queryInterface.createTable('HTRInstanceVersus', {
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          htrInstanceId: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          versusId: {
            allowNull: false,
            type: Sequelize.INTEGER
          }
        })
      )
      .then(() =>
        queryInterface.addIndex('htrInstanceVersus', {
          fields: ['htrInstanceId']
        })
      );
  }
};
