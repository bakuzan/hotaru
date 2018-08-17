const Sequelize = require('sequelize');

const Constants = require('../constants/index');
const migrate = require('../config');

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

// Create relationships
SeriesModel.hasMany(CharacterModel);
CharacterModel.belongsTo(SeriesModel);

CharacterModel.belongsToMany(TagModel, {
  through: 'CharacterTag'
});
TagModel.belongsToMany(CharacterModel, {
  through: 'CharacterTag'
});

// Sync to create db if not exist
// then run migration scripts
db.sync({ force: true }).then(() => migrate(db));

const Character = db.models.character;
const Series = db.models.series;
const Tag = db.models.tag;

module.exports = { db, Character, Series, Tag };
