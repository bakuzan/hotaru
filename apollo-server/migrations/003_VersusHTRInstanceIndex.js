module.exports = {
  up: (queryInterface) => {
    return queryInterface.addIndex('versus', {
      fields: ['htrInstanceId']
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeIndex('versus', 'versus_htr_instance_id');
  }
};
