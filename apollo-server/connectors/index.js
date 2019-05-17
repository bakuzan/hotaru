const Sequelize = require('sequelize');

const Constants = require('../constants/index');
const Utils = require('../utils');
const migrate = require('../config');
const TestData = require('../config/testData');

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
const CharacterOfTheDayModel = db.import('./characterOfTheDay');
const HTRTemplateModel = db.import('./htrTemplate');
const HTRInstanceModel = db.import('./htrInstance');

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

CharacterModel.CotD = CharacterModel.hasMany(CharacterOfTheDayModel);
CharacterOfTheDayModel.Character = CharacterOfTheDayModel.belongsTo(
  CharacterModel
);

HTRTemplateModel.Instance = HTRTemplateModel.hasMany(HTRInstanceModel);
HTRInstanceModel.Template = HTRInstanceModel.belongsTo(HTRTemplateModel, {
  foreignKey: 'htrTemplateId'
});

HTRInstanceModel.Character = HTRInstanceModel.belongsToMany(CharacterModel, {
  through: 'HTRInstanceCharacter',
  foreignKey: 'htrInstanceId'
});
CharacterModel.HTRInstance = CharacterModel.belongsToMany(HTRInstanceModel, {
  through: 'HTRInstanceCharacter',
  foreignKey: 'characterId'
});

HTRInstanceModel.Versus = HTRInstanceModel.hasMany(VersusModel);
VersusModel.HTRInstance = VersusModel.belongsTo(HTRInstanceModel);

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
