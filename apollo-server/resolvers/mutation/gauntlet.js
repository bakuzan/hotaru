const Op = require('sequelize').Op;
const { db, Versus, Character } = require('../../connectors');
const { VersusTypes } = require('../../constants/enums');

module.exports = {
  async gauntletCreate(_, { characterId }, context) {
    const character = await context.Gauntlet.getGauntletCharacterIfValid(
      characterId
    );

    if (!character) {
      return {
        success: false,
        errorMessages: [
          `Character not a valid gauntlet contenter. (CharacterId: ${characterId})`
        ],
        data: null
      };
    }

    const countData = await Versus.findAll({
      include: [Character],
      attributes: [
        [
          db.fn('COUNT', db.col('versus->VersusCharacter.characterId')),
          'versusCount'
        ]
      ],
      group: ['versus->VersusCharacter.characterId'],
      order: [['versusCount', 'desc']],
      limit: 1
    });
    console.log('COUNTDATA > ', countData);

    const numberOfVersusToCreate = Math.min(
      10,
      countData.versusCount - character.versusCount
    );

    if (!numberOfVersusToCreate) {
      return {
        success: false,
        errorMessages: [
          `No gauntlet versus could be created for ${
            character.name
          }. (CharacterId: ${characterId})`
        ],
        data: null
      };
    }
    console.log('TO CREATE > ', numberOfVersusToCreate);

    return await db.transaction(async (transaction) => {
      const opponents = await Character.findAll({
        where: { id: { [Op.ne]: characterId } },
        order: db.literal('RANDOM()'),
        limit: numberOfVersusToCreate,
        transaction
      });

      const versusShells = opponents.map(() => ({
        type: VersusTypes.Gauntlet
      }));
      const createdAt = Date.now() - 1000;

      await Versus.bulkCreate(versusShells, {
        transaction
      });

      const promises = [];
      const createdVersus = await Versus.findAll({
        where: { createdAt: { [Op.gte]: createdAt } },
        transaction
      });

      createdVersus.forEach((v, i) => {
        const pairing = [characterId, opponents[i].id];
        promises.push(v.setCharacters(pairing, { transaction }));
      });

      await Promise.all(promises);

      const versusIds = createdVersus.map((x) => x.id);
      const newVersusItems = await Versus.findAll({
        where: { id: { [Op.in]: versusIds } },
        include: [Character],
        transaction
      });

      const newVersusCount = character.versusCount + numberOfVersusToCreate;
      return {
        success: true,
        errorMessages: [],
        data: {
          canContinue: countData.versusCount - newVersusCount > 0,
          character,
          versus: newVersusItems
        }
      };
    });
  }
};
