const gql = require('graphql-tag');

const { mapArrToGraphqlString } = require('../utils');
const { GenderType, SourceType, VersusType } = require('../constants/enums');

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

const VersusTypeGQL = gql`
  enum VersusType {
    ${mapArrToGraphqlString(VersusType)}
  }
`;

module.exports = [GenderTypeGQL, SourceTypeGQL, VersusTypeGQL];
