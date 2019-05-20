const { db, Character } = require('../connectors');
const SQL = require('../db-scripts');
const Utils = require('../utils');

const processArray = require('./utils/processArray');

const GET_CHARACTERS = 'get_valid_gauntlet_characters';
const COUNT_CHARACTERS = 'get_valid_gauntlet_characters_count';

async function countGauntletCharacters({
  characterId = null,
  search = '',
  genders = [],
  sources = []
}) {
  const [result] = await db.query(SQL[COUNT_CHARACTERS], {
    type: db.QueryTypes.SELECT,
    replacements: {
      characterId,
      search: `%${search}%`,
      genders: processArray(genders),
      sources: processArray(sources)
    }
  });

  return result && result.total ? result.total : 0;
}

async function getGauntletCharacters({
  characterId = null,
  search = '',
  genders = [],
  sources = [],
  paging = { page: 0, size: 10 }
}) {
  return await db.query(SQL[GET_CHARACTERS], {
    type: db.QueryTypes.SELECT,
    replacements: {
      characterId,
      search: `%${search}%`,
      genders: processArray(genders),
      sources: processArray(sources),
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

async function getGauntletCharacterIfValid(characterId) {
  const [character] = await getGauntletCharacters({
    characterId,
    paging: { size: 1000, page: 0 }
  });

  return character || null;
}

async function getMaxVersusCount() {
  const [{ versusCount: maxVersusCount }] = await Character.findAll({
    attributes: {
      include: [
        [
          db.literal(
            '(SELECT COUNT(*) FROM VersusCharacter as vc WHERE vc.characterId = character.id)'
          ),
          'versusCount'
        ]
      ]
    },
    order: [[db.literal('versusCount'), 'desc']],
    limit: 1,
    raw: true
  });

  return maxVersusCount;
}

module.exports = {
  findGauntletCharactersAndCount,
  getGauntletCharacterIfValid,
  getMaxVersusCount
};
