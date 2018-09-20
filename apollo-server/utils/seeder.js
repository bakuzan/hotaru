const { orderBy } = require('./index');
const bracketCorrector = require('./bracket-corrector');

module.exports = function seeder(chara, bracketLimit) {
  const characters = bracketCorrector(chara, bracketLimit);
  const orderedCharacters = orderBy(characters, ['ranking.rank']);

  const stack1 = [];
  const stack2 = [];
  const repeats = orderedCharacters.length / 2;
  for (let i = 0; i < repeats; i++) {
    const stack = i % 2 === 0 ? stack1 : stack2;
    stack.push(orderedCharacters.shift());
    stack.push(orderedCharacters.pop());
  }

  return stack1.concat(stack2);
};
