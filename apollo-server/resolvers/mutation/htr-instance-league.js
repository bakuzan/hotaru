const Op = require('sequelize').Op;

const {
  db,
  HTRTemplate,
  HTRInstance,
  Versus,
  Character
} = require('../../connectors');

const { HTRTemplateTypes, VersusTypes } = require('../../constants/enums');
const Utils = require('../../utils');

module.exports = {
  htrInstanceLeagueCreate(_, __, context) {
    return db.transaction(async (transaction) => {
      const createdAt = Date.now();

      const activeInstance = await context.HTRInstanceLeague.checkForActiveLeague(
        { transaction }
      );

      if (activeInstance) {
        throw Error(
          'At least one league is still currently active in the latest season.'
        );
      }

      const seasonCount = await HTRTemplate.count({
        where: {
          type: {
            [Op.eq]: HTRTemplateTypes.League
          }
        },
        transaction
      });

      const seasonNumber = seasonCount + 1;
      const seasonName = `Season ${seasonNumber}`;
      const newTemplate = {
        name: seasonName,
        type: HTRTemplateTypes.League,
        rules: ''
      };

      const template = await HTRTemplate.create(newTemplate, { transaction });

      const allCharacters = await Character.findAll({
        raw: true,
        attributes: ['id'],
        order: db.literal('RANDOM()'),
        transaction
      });

      const chunkedCharacters = Utils.chunk(allCharacters, 20);

      const newInstances = chunkedCharacters.map((cArr, i) => {
        const n = cArr.length;
        const leagueNumber = i + 1;
        const seasonOrdinal = Utils.getOrdinalNum(seasonNumber);
        const leagueOrdinal = Utils.getOrdinalNum(leagueNumber);

        return {
          name: `League ${leagueNumber}`,
          description: `The ${leagueNumber}${leagueOrdinal} league of the ${seasonNumber}${seasonOrdinal} season.`,
          settings: {
            isComplete: false,
            limit: cArr.map((_, i) => n - 1 - i).reduce((p, c) => p + c, 0),
            layout: []
          },
          htrTemplateId: template.id
        };
      });

      await HTRInstance.bulkCreate(newInstances, { transaction });
      const createdInstances = await HTRInstance.findAll({
        where: { createdAt: { [Op.gte]: createdAt } },
        transaction
      });

      const associations = [];
      createdInstances.map((instance, i) => {
        const chara = chunkedCharacters[i];
        const characterIds = chara.map((x) => x.id);
        associations.push(
          instance.setCharacters(characterIds, { transaction })
        );
      });

      return Promise.all(associations).then(() => template);
    });
  }
};
