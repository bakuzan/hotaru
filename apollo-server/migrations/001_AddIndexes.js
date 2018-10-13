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
      .removeIndex('characters', { fields: ['seriesId'] })
      .then(() =>
        queryInterface.removeIndex('rankings', { fields: ['characterId'] })
      )
      .then(() =>
        queryInterface.removeIndex('htrInstanceVersus', {
          fields: ['htrInstanceId']
        })
      )
      .then(() =>
        queryInterface.removeIndex('htrInstanceCharacter', {
          fields: ['htrInstanceId']
        })
      )
      .then(() =>
        queryInterface.removeIndex('htrInstances', {
          fields: ['htrTemplateId']
        })
      )
      .then(() =>
        queryInterface.removeIndex('VersusCharacter', {
          fields: ['versusId']
        })
      )
      .then(() =>
        queryInterface.removeIndex('CharacterTag', {
          fields: ['characterId']
        })
      );
  }
};
