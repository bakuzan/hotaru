const Op = require('sequelize').Op;

const { db, Character } = require('../../connectors');
const SQL = require('../../db-scripts');

const Utils = require('../../utils');

const Keys = {
  mostWinsInLast7Days: 1,
  mostWinsInLast30Days: 2,
  mostCommonVersus: 3,
  closestRivalry: 4,
  longestVersus: 5
};

module.exports = {
  async honours() {
    const weekAgo = Utils.getDaysAgoX(7);
    const monthAgo = Utils.getDaysAgoX(30);

    const mostWinsInLast = await db.query(SQL['get_most_wins_for_days'], {
      type: db.QueryTypes.SELECT,
      replacements: { daysAgo1: weekAgo, daysAgo2: monthAgo }
    });
    console.log('WINS IN LAST', mostWinsInLast, 'END');
    const mostWinsInLast7Days = mostWinsInLast.find(
      (x) => x.rbnkey === Keys.mostWinsInLast7Days
    );
    const mostWinsInLast30Days = mostWinsInLast.find(
      (x) => x.rbnkey === Keys.mostWinsInLast30Days
    );

    const frequentVersus = await db.query(SQL['get_most_frequent_versus'], {
      type: db.QueryTypes.SELECT
    });
    const mostCommonVersus = frequentVersus.find(
      (x) => x.rbnkey === Keys.mostCommonVersus
    );
    const closestRivalry = frequentVersus.find(
      (x) => x.rbnkey === Keys.closestRivalry
    );

    const [longestVersus] = await db.query(SQL['get_longest_versus'], {
      type: db.QueryTypes.SELECT
    });

    const characterIds = [
      mostCommonVersus,
      closestRivalry,
      longestVersus
    ].reduce((p, c) => (c ? [...p, c.cId1, c.cId2] : [...p]), []);
    const versusCharacters = await Character.findAll({
      raw: true,
      where: {
        id: { [Op.in]: characterIds }
      },
      attributes: ['id', 'name', 'displayImage']
    });

    console.log(
      mostWinsInLast7Days,
      mostWinsInLast30Days,
      mostCommonVersus,
      closestRivalry,
      longestVersus
    );
    return {
      mostWinsInLast7Days: {
        ...mostWinsInLast7Days,
        key: Keys.mostWinsInLast7Days
      },
      mostWinsInLast30Days: {
        ...mostWinsInLast30Days,
        key: Keys.mostWinsInLast30Days
      },
      mostCommonVersus: {
        ...mostCommonVersus,
        key: Keys.mostCommonVersus,
        characters: versusCharacters.filter(
          (x) =>
            x.id === mostCommonVersus.cId1 || x.id === mostCommonVersus.cId2
        )
      },
      ...(closestRivalry
        ? {
            closestRivalry: {
              ...closestRivalry,
              key: Keys.closestRivalry,
              characters: versusCharacters.filter(
                (x) =>
                  x.id === closestRivalry.cId1 || x.id === closestRivalry.cId2
              )
            }
          }
        : {}),
      ...(longestVersus
        ? {
            longestVersus: {
              ...longestVersus,
              key: Keys.longestVersus,
              characters: versusCharacters.filter(
                (x) =>
                  x.id === longestVersus.cId1 || x.id === longestVersus.cId2
              )
            }
          }
        : {})
    };
  }
};
