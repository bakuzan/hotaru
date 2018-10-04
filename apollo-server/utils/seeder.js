const { orderBy } = require('./index');
const bracketCorrector = require('./bracket-corrector');

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

  const stack1 = [];
  const stack2 = [];
  const repeats = mappedCharacters.length / 2;
  for (let i = 0; i < repeats; i++) {
    const stack = i % 2 === 0 ? stack1 : stack2;
    stack.push(mappedCharacters.shift());
    stack.push(mappedCharacters.pop());
  }

  return { characters: stack1.concat(stack2), seedOrder };
};
