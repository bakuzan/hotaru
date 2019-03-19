const Op = require('sequelize').Op;

const { db, Character, Series, Versus } = require('../../connectors');

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
    const versus = await Versus.findAll({
      where: { type: VersusTypes.Gauntlet, winnerId: null },
      include: [Character],
      raw: true
    });

    // TODO
    // Filter versus to find the most common characterId || 0
    const characterId = 0;
    const character = await Character.findByPk(characterId);

    return {
      canContinue: false,
      character,
      versus
    };
  }
};
