const gql = require('graphql-tag');

module.exports = gql`
  type HTRInstance {
    id: Int!
    name: String
    description: String
    settings: HTRInstanceSettings
    htrTemplateId: Int
    htrTemplate: HTRTemplate
    characters: [Character]
    versus: [Versus]
    type: HTRTemplateType
  }
  type HTRInstanceSettings {
    rules: HTRTemplateRules
    limit: Int
    "Current Status - Bracket type only"
    status: BracketStatus
    "Bracket Winner - Bracket type only"
    winnerId: Int
    "Character sort order - List type only"
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
