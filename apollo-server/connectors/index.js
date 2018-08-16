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

// Create relationships
SeriesModel.hasMany(CharacterModel);
CharacterModel.belongsTo(SeriesModel);

// Sync to create db if not exist
// then run migration scripts
db.sync({ force: true }).then(() => migrate(db));

const Character = db.models.character;
const Series = db.models.series;

module.exports = { db, Character, Series };
