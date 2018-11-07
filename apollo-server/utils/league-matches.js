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

module.exports = function leagueMatchPairs(characters) {
  const pairs = [];
  const n = characters.length - 1;

  characters.forEach((c, i) =>
    inputs.forEach((k, j) => (i < j ? pairs.push([c.id, k.id]) : null))
  );
  console.log(n, 'pairings > ', pairs);
};
