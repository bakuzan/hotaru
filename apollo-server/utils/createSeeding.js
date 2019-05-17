const bracketCorrector = require('./bracketCorrector');

const generateSeed = (n) =>
  n === 1
    ? [0]
    : generateSeed(n >> 1).reduce((p, c) => [...p, c, n - c - 1], []);

module.exports = async function createSeeding(
  ctx,
  chara,
  { bracketLimit, ...opts }
) {
  const characters = bracketCorrector(chara, bracketLimit);

  const orderedCharacters = await ctx.Ranking.getRankings(
    {
      search: '',
      genders: null,
      sources: null,
      seriesIds: null,
      characterIds: characters.map((x) => x.id),
      skipNum: 0,
      takeNum: 10000
    },
    opts
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
