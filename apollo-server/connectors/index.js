const Sequelize = require('sequelize');

const Constants = require('../constants/index');
const Utils = require('../utils');
const migrate = require('../config');
const TestData = require('../config/testData');
const extraSetup = require('./extraSetup');

const db = new Sequelize(Constants.appName, null, null, {
  dialect: 'sqlite',
  storage: `${process.env.DB_STORAGE_PATH}${Constants.appName}.${process.env.NODE_ENV}.sqlite`,
  operatorsAliases: false
});

const modelDefiners = [
  require('./character'),
  require('./series'),
  require('./tag'),
  require('./image'),
  require('./versus'),
  require('./characterOfTheDay'),
  require('./htrTemplate'),
  require('./htrInstance')
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(db);
}

// Other db setup...
extraSetup(db);

// Sync and Migrate db
// Only add test data if sync is forced
// Populate rankings
const FORCE_DB_REBUILD = Utils.castStringToBool(process.env.FORCE_DB_REBUILD);
const SEED_DB = Utils.castStringToBool(process.env.SEED_DB);

db.sync({ force: FORCE_DB_REBUILD })
  .then(() => migrate(db))
  .then(async () => {
    if (FORCE_DB_REBUILD && SEED_DB) {
      const { series, character, tag, htrTemplate } = db.models;
      await series.bulkCreate(TestData.series);
      await character.bulkCreate(TestData.characters);
      await tag.bulkCreate(TestData.tags);
      await htrTemplate.bulkCreate(TestData.templates);
    }
  });

const Character = db.models.character;
const Series = db.models.series;
const Tag = db.models.tag;
const Image = db.models.image;
const Versus = db.models.versus;
const CharacterOfTheDay = db.models.characterOfTheDay;
const HTRTemplate = db.models.htrTemplate;
const HTRInstance = db.models.htrInstance;

module.exports = {
  db,
  Character,
  Series,
  Tag,
  Image,
  Versus,
  CharacterOfTheDay,
  HTRTemplate,
  HTRInstance
};
