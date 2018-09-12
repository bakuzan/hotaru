const gql = require('graphql-tag');

module.exports = gql`
  type HTRTemplate {
    id: Int!
    name: String
    type: HTRTemplateType
    rules: HTRTemplateRules
  }
  type HTRTemplateRules {
    genders: [GenderType]
    series: [Int]
    sources: [SourceType]
  }
  input HTRTemplateInput {
    name: String
    type: HTRTemplateType
    rules: HTRTemplateRulesInput
  }
  input HTRTemplateUpdateInput {
    name: String
    rules: HTRTemplateRulesInput
  }
  input HTRTemplateRulesInput {
    genders: [GenderType]
    series: [Int]
    sources: [SourceType]
  }

  type HTRInstance {
    id: Int!
    name: String
    description: String
    settings: HTRInstanceSettings
    htrTemplateId: Int
    htrTemplate: HTRTemplate
    characters: [Character]
    versus: [Versus]
  }
  type HTRInstanceSettings {
    rules: HTRTemplateRules
    limit: Int
    status: BracketStatus
    order: [[String]]
  }
  input HTRInstanceInput {
    name: String
    description: String
    settings: HTRInstanceSettingsInput
  }
  input HTRInstanceSettingsInput {
    rules: HTRTemplateRulesInput
    limit: Int
    status: BracketStatus
    order: [[String]]
  }
`;
