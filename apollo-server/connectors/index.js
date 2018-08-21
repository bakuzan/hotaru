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
const ImageModel = db.import('./image');

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

// Sync to create db if not exist
// then run migration scripts

const isDevelopment = process.env.NODE_ENV !== Constants.environment.production;
db.sync({
  force: isDevelopment,
  logging: isDevelopment
}).then(() => migrate(db));

const Character = db.models.character;
const Series = db.models.series;
const Tag = db.models.tag;
const Image = db.models.image;

module.exports = {
  db,
  Character,
  Series,
  Tag,
  Image
};
