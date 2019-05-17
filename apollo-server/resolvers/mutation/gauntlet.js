const Op = require('sequelize').Op;
const { db, Versus, Character } = require('../../connectors');
const { VersusTypes } = require('../../constants/enums');

const canContinueGauntlet = require('../../utils/canContinueGauntlet');

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

    const maxVersusCount = await context.Gauntlet.getMaxVersusCount();

    const numberOfVersusToCreate = Math.min(
      10,
      maxVersusCount - character.versusCount
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
    } else if (numberOfVersusToCreate === 1) {
      return {
        success: false,
        errorMessages: [
          `${
            character.name
          } is no longers a valid gauntlet contender. (CharacterId: ${characterId})`
        ],
        data: null
      };
    }

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

      return await Promise.all(promises).then(async () => {
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
            canContinue: canContinueGauntlet(maxVersusCount, newVersusCount),
            character,
            versus: newVersusItems
          }
        };
      });
    });
  }
};
