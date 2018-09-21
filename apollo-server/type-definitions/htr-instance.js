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
    "Bracket Layout - Bracket type only"
    layout: [[Int]]
    "Character sort order - List type only"
    order: Int
    customOrder: [Int]
  }
  input HTRInstanceInput {
    id: Int
    name: String
    description: String
    htrTemplateId: Int
    characterIds: [Int]
    settings: HTRInstanceSettingsInput
  }
  input HTRInstanceSettingsInput {
    rules: HTRTemplateRulesInput
    limit: Int
    "Current Status - Bracket type only"
    status: BracketStatus
    "Bracket Winner - Bracket type only"
    winnerId: Int
    "Bracket Layout - Bracket type only"
    layout: [[Int]]
    "Character sort order - List type only"
    order: Int
    customOrder: [Int]
  }
`;
