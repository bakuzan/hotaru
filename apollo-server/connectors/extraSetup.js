module.exports = function applyExtraSetup(db) {
  const CharacterModel = db.models.character;
  const SeriesModel = db.models.series;
  const TagModel = db.models.tag;
  const ImageModel = db.models.image;
  const VersusModel = db.models.versus;
  const CharacterOfTheDayModel = db.models.characterOfTheDay;
  const HTRTemplateModel = db.models.htrTemplate;
  const HTRInstanceModel = db.models.htrInstance;

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
  CharacterOfTheDayModel.Character =
    CharacterOfTheDayModel.belongsTo(CharacterModel);

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
};
