const { orderBy, flatten, chunk, compose } = require('./index');
const bracketCorrector = require('./bracket-corrector');

function createStacks(input = []) {
  const items = [...input];
  const stack1 = [];
  const stack2 = [];
  const repeats = items.length / 2;
  for (let i = 0; i < repeats; i++) {
    const stack = i % 2 === 0 ? stack1 : stack2;
    stack.push(items.shift());
    stack.push(items.pop());
  }

  return [stack1, stack2];
}

const pairStackAndFlatten = compose(
  (x) => flatten(x, 2),
  createStacks,
  (x) => chunk(x, 2)
);

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

  const stacks = createStacks(mappedCharacters);
  const [stack1, stack2] = stacks.map(pairStackAndFlatten);

  return { characters: stack1.concat(stack2), seedOrder };
};
