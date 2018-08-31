const Sequelize = require('sequelize');

const Constants = require('../constants/index');
const migrate = require('../config');
const TestData = require('../config/test-data');
const SQL = require('../db-scripts');

const db = new Sequelize(Constants.appName, null, null, {
  dialect: 'sqlite',
  storage: `${process.env.DB_STORAGE_PATH}${Constants.appName}.${
    process.env.NODE_ENV
  }.sqlite`,
  operatorsAliases: false
});

const CharacterModel = db.import('./character');
const SeriesModel = db.import('./series');
const TagModel = db.import('./tag');
const ImageModel = db.import('./image');
const VersusModel = db.import('./versus');
const RankingModel = db.import('./ranking');

// Create relationships
SeriesModel.Character = SeriesModel.hasMany(CharacterModel);
CharacterModel.Series = CharacterModel.belongsTo(SeriesModel);

CharacterModel.Image = CharacterModel.hasMany(ImageModel);
ImageModel.Character = ImageModel.belongsTo(CharacterModel);

CharacterModel.Tag = CharacterModel.belongsToMany(TagModel, {
  through: 'CharacterTag'
});
TagModel.Character = TagModel.belongsToMany(CharacterModel, {
  through: 'CharacterTag'
});

VersusModel.Character = VersusModel.belongsToMany(CharacterModel, {
  through: 'VersusCharacter',
  foreignKey: 'versusId'
});
CharacterModel.Character = CharacterModel.belongsToMany(VersusModel, {
  through: 'VersusCharacter',
  foreignKey: 'characterId'
});

VersusModel.Winner = VersusModel.belongsTo(CharacterModel, { as: 'winner' });

RankingModel.Character = RankingModel.belongsTo(CharacterModel);

// Sync and Migrate db
// Only add test data if sync is forced
// Populate rankings
const FORCE_DB_REBUILD = process.env.FORCE_DB_REBUILD || false;
db.sync({ force: FORCE_DB_REBUILD })
  .then(() => migrate(db))
  .then(async () => {
    if (FORCE_DB_REBUILD) {
      const { series, character, tag } = db.models;
      await series.bulkCreate(TestData.series);
      await character.bulkCreate(TestData.characters);
      await tag.bulkCreate(TestData.tags);
    }
  })
  .then(() => db.query(SQL.populateRankings));

const Character = db.models.character;
const Series = db.models.series;
const Tag = db.models.tag;
const Image = db.models.image;
const Versus = db.models.versus;
const Ranking = db.models.ranking;

module.exports = {
  db,
  Character,
  Series,
  Tag,
  Image,
  Versus,
  Ranking
};
