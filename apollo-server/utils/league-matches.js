var inputs = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 }
];

// https://stackoverflow.com/questions/1293058/round-robin-tournament-algorithm-in-c-sharp?rq=1

module.exports = function leagueMatchPairs(characters) {
  const characterCount = characters.length;
  if (characterCount % 2 !== 0) {
    throw Error('Odd count of characters not handled yet.');
  }

  const n = characterCount - 1;
  const half = characterCount / 2;
  const staged = [];

  staged.push(...characters.slice(half));
  staged.push(...characters.slice(1, half).reverse());

  const output = [];
  for (let i = 1; i < n; i++) {
    const charaIdx = i % n;
    const chara = staged[charaIdx];
    output.push(chara, staged[0]);
    for (let j = 1; j < half; j++) {
      const first = (i + j) % n;
      const second = (i + n - j) % n;
      output.push([staged[first], staged[second]]);
    }
  }

  //   characters.forEach((c, i) =>
  //     inputs.forEach((k, j) => (i < j ? pairs.push([c.id, k.id]) : null))
  //   );
  //   console.log(n, 'pairings > ', pairs);
};
