const gql = require('graphql-tag');

const { mapArrToGraphqlString } = require('../utils');
const { GenderType } = require('../constants/enums');

const GenderTypeGQL = gql`
  enum GenderType {
    ${mapArrToGraphqlString(GenderType)}
  }
`;

module.exports = [GenderTypeGQL];
