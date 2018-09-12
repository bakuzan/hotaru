const gql = require('graphql-tag');

const { mapArrToGraphqlString } = require('../utils');
const {
  GenderType,
  SourceType,
  VersusType,
  HTRTemplateType,
  BracketStatus
} = require('../constants/enums');

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

const HTRTemplateTypeGQL = gql`
  enum HTRTemplateType {
    ${mapArrToGraphqlString(HTRTemplateType)}
  }
`;

const BracketStatusGQL = gql`
  enum BracketStatus {
    ${mapArrToGraphqlString(BracketStatus)}
  }
`;

module.exports = [
  GenderTypeGQL,
  SourceTypeGQL,
  VersusTypeGQL,
  HTRTemplateTypeGQL,
  BracketStatusGQL
];
