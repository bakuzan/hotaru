const { Character, Versus } = require('../../connectors');
const { VersusTypes } = require('../../constants/enums');

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
  async activeGauntlet() {
    let character = null;
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
    }

    return {
      canContinue: false,
      character,
      versus
    };
  }
};
