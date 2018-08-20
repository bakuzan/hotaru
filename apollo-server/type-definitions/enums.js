const gql = require('graphql-tag');

const { mapArrToGraphqlString } = require('../utils');
const { GenderType, SourceType } = require('../constants/enums');

const GenderTypeGQL = gql`
  enum GenderType {
    ${mapArrToGraphqlString(GenderType)}
  }
`;

const SourceTypeGQL = gql`
  enum SourceType {
    ${mapArrToGraphqlString(SourceType)}
  }
`;

module.exports = [GenderTypeGQL, SourceTypeGQL];
