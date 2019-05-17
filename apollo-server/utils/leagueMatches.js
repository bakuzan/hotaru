module.exports = function leagueMatchPairs(characters) {
  const characterCount = characters.length;
  if (characterCount % 2 !== 0) {
    throw Error('Odd count of characters not handled yet.');
  }

  const characterIds = characters.map((x) => x.id);
  const n = characterCount - 1;
  const half = characterCount / 2;
  const staged = [];

  staged.push(...characterIds.slice(1));

  const stagedSize = staged.length;
  const output = [];

  for (let i = 0; i < n; i++) {
    const charaIdx = i % stagedSize;
    output.push([staged[charaIdx], characterIds[0]]);

    for (let j = 1; j < half; j++) {
      const first = (i + j) % stagedSize;
      const second = (i + stagedSize - j) % stagedSize;
      output.push([staged[first], staged[second]]);
    }
  }

  return output;
};
