const { orderBy } = require('./index');
const bracketCorrector = require('./bracket-corrector');

const generateSeed = (n) =>
  n === 1
    ? [0]
    : generateSeed(n >> 1).reduce((p, c) => [...p, c, n - c - 1], []);

module.exports = function seeder(chara, bracketLimit) {
  const characters = bracketCorrector(chara, bracketLimit);
  const orderedCharacters = orderBy(
    characters.map((x) => x.get({ plain: true })),
    ['ranking.rank']
  );

  const seedOrder = orderedCharacters.map((x) => x.id);
  const mappedCharacters = orderedCharacters.map((x) =>
    characters.find((c) => c.id === x.id)
  );

  const seededCharacters = generateSeed(characters.length).map(
    (i) => mappedCharacters[i]
  );

  return { characters: seededCharacters, seedOrder };
};
