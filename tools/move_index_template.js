const fs = require('fs');

const source = './dist/index.html';
const target = './public/index.html';

async function moveIt() {
  const file = await fs.readFileSync(source);
  return await fs.writeFileSync(target, file);
}

moveIt()
  .then(() => console.log('Done'))
  .catch((err) => console.log('Failed', err));
