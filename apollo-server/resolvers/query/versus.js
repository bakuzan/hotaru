const Op = require('sequelize').Op;

const { db, Versus, Character } = require('../../connectors');
const SQL = require('../../db-scripts');
const Utils = require('../../utils');

module.exports = {
  versusDailyActive() {
    const todayMidnight = new Date();
    todayMidnight.setUTCHours(0, 0, 0, 0);

    return Versus.findAll({
      where: {
        type: 'Daily',
        [Op.or]: [
          {
            createdAt: {
              [Op.gt]: todayMidnight
            }
          },
          {
            winnerId: {
              [Op.eq]: null
            }
          }
        ]
      },
      order: [['createdAt', 'DESC']],
      include: [Character]
    });
  },
  async versusHistoryComparison(_, { characterIds }) {
    const [c1, c2] = characterIds;
    const headToHead = await db.query(
      SQL['get_versus_history_for_characters'],
      {
        type: db.QueryTypes.SELECT,
        replacements: { c1, c2 }
      }
    );

    const sharedOpponents = await db.query(SQL['get_shared_opponent_history'], {
      type: db.QueryTypes.SELECT,
      replacements: { c1, c2 }
    });

    return {
      headToHead,
      sharedOpponents
    };
  },
  versusSinglesNotWon() {
    return Versus.findAll({
      where: {
        type: 'Single',
        winnerId: {
          [Op.eq]: null
        }
      }
    });
  },
  versusHistoryPaged(_, { characterId, paging }) {
    return Versus.findAndCountAll({
      order: [['updatedAt', 'DESC']],
      limit: paging.size,
      offset: paging.size * paging.page,
      include: [
        {
          model: Character,
          where: {
            id: { [Op.eq]: characterId }
          }
        }
      ]
    }).then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: Utils.setHasMoreFlag(result.count, paging)
    }));
  }
};
