const { db } = require('../connectors');
const SQL = require('../db-scripts');

const GET_CHARACTERS = SQL['get_valid_gauntlet_characters'];
const COUNT_CHARACTERS = SQL['get_valid_gauntlet_characters_count'];

async function countGauntletCharacters({
  characterId = null,
  search = '',
  genders = [],
  sources = []
}) {
  return await db.query(COUNT_CHARACTERS, {
    type: db.QueryTypes.SELECT,
    replacements: { characterId, search, genders, sources }
  });
}

async function getGauntletCharacters({
  characterId = null,
  search = '',
  genders = [],
  sources = [],
  paging = { page: 0, size: 10 }
}) {
  return await db.query(GET_CHARACTERS, {
    type: db.QueryTypes.SELECT,
    replacements: {
      characterId,
      search,
      genders,
      sources,
      limit: paging.size,
      offset: paging.size * paging.page
    }
  });
}

async function findGauntletCharactersAndCount({ paging, ...args }) {
  const total = await countGauntletCharacters(args);
  const characters = await getGauntletCharacters({ paging, ...args });

  return {
    nodes: characters,
    total,
    hasMore: Utils.setHasMoreFlag(total, paging)
  };
}

async function isValidGauntletCharacter(characterId) {
  const count = await countGauntletCharacters({
    characterId
  });

  return count > 0;
}

async function getGauntletCharacterIfValid(characterId) {
  const [character] = await getGauntletCharacters({
    characterId,
    paging: { size: 1000, page: 0 }
  });

  return character || null;
}

module.exports = {
  getGauntletCharacters,
  findGauntletCharactersAndCount,
  isValidGauntletCharacter,
  getGauntletCharacterIfValid
};
