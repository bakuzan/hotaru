const gql = require('graphql-tag');

module.exports = gql`
  type HTRTemplate {
    id: Int!
    name: String
    type: HTRTemplateType
    rules: HTRTemplateRules
    rulesSeries: [Series]
  }
  type HTRTemplateRules {
    genders: [GenderType]
    series: [Int]
    sources: [SourceType]
    limit: Int
    isSeeded: Boolean
  }
  type HTRTemplatePage {
    nodes: [HTRTemplate]
    total: Int
    hasMore: Boolean
  }
  input HTRTemplateInput {
    name: String
    type: HTRTemplateType
    rules: HTRTemplateRulesInput
  }
  input HTRTemplateUpdateInput {
    id: Int
    name: String
    rules: HTRTemplateRulesInput
  }
  input HTRTemplateRulesInput {
    genders: [GenderType]
    series: [Int]
    sources: [SourceType]
    limit: Int
    isSeeded: Boolean
  }
`;
