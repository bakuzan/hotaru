module.exports = {
  up: (queryInterface) => {
    return queryInterface
      .addIndex('characters', { fields: ['seriesId'] })
      .then(() =>
        queryInterface.addIndex('rankings', { fields: ['characterId'] })
      )
      .then(() =>
        queryInterface.addIndex('htrInstanceVersus', {
          fields: ['htrInstanceId']
        })
      )
      .then(() =>
        queryInterface.addIndex('htrInstanceCharacter', {
          fields: ['htrInstanceId']
        })
      )
      .then(() =>
        queryInterface.addIndex('htrInstances', {
          fields: ['htrTemplateId']
        })
      )
      .then(() =>
        queryInterface.addIndex('VersusCharacter', {
          fields: ['versusId']
        })
      )
      .then(() =>
        queryInterface.addIndex('CharacterTag', {
          fields: ['characterId']
        })
      );
  },
  down: (queryInterface) => {
    return queryInterface
      .removeIndex('characters', 'characters_series_id')
      .then(() =>
        queryInterface.removeIndex('rankings', 'rankings_character_id')
      )
      .then(() =>
        queryInterface.removeIndex(
          'htrInstanceVersus',
          'htr_instance_versus_htr_instance_id'
        )
      )
      .then(() =>
        queryInterface.removeIndex(
          'htrInstanceCharacter',
          'htr_instance_character_htr_instance_id'
        )
      )
      .then(() =>
        queryInterface.removeIndex(
          'htrInstances',
          'htr_instances_htr_template_id'
        )
      )
      .then(() =>
        queryInterface.removeIndex(
          'VersusCharacter',
          'versus_character_versus_id'
        )
      )
      .then(() =>
        queryInterface.removeIndex('CharacterTag', 'Character_tag_character_id')
      );
  }
};
