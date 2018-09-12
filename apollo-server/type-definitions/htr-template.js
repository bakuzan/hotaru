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
    order: [[String]]
  }
  input HTRTemplateInput {
    name: String
    type: HTRTemplateType
    rules: HTRTemplateRules
  }
  input HTRTemplateUpdateInput {
    name: String
    rules: HTRTemplateRules
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
  }
  input HTRInstanceInput {
    name: String
    description: String
    settings: HTRInstanceSettings
  }
`;
