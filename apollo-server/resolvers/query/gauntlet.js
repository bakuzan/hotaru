const { Character, Versus } = require('../../connectors');
const { VersusTypes } = require('../../constants/enums');

const canContinueGauntlet = require('../../utils/can-continue-gauntlet');

module.exports = {
  async gauntletCharacters(
    _,
    { search = '', genders, sources, paging = { page: 0, size: 10 } },
    context
  ) {
    return await context.Gauntlet.findGauntletCharactersAndCount({
      search,
      genders,
      sources,
      paging
    });
  },
  async activeGauntlet(_, __, context) {
    let character = null;
    let canContinue = false;
    const versus = await Versus.findAll({
      where: { type: VersusTypes.Gauntlet, winnerId: null },
      include: [Character]
    });

    if (versus.length) {
      const checkVersus = await Versus.findAll({
        include: [Character],
        where: { type: VersusTypes.Gauntlet },
        order: [['createdAt', 'DESC']],
        limit: 2
      });

      character = checkVersus.reduce((p, v) =>
        p.characters
          .filter((x) => v.characters.some((c) => c.id === x.id))
          .pop()
      );

      const maxVersusCount = await context.Gauntlet.getMaxVersusCount();
      const ch = await context.Gauntlet.getGauntletCharacterIfValid(
        character.id
      );
      canContinue = !!ch && canContinueGauntlet(maxVersusCount, ch.versusCount);
    }

    return {
      canContinue,
      character,
      versus
    };
  }
};
