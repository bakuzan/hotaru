module.exports = {
  up: (queryInterface) => {
    return queryInterface.dropTable('rankings');
  },
  down: () => {
    console.log(
      'Attempted to downgrade, No downgrade available for "004_DropRankingTable"'
    );
  }
};
