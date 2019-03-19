const gql = require('graphql-tag');

module.exports = gql`
  type GauntletResponse {
    canContinue: Boolean
    character: Character
    versus: [Versus]
  }
  type GauntletCreateResponse {
    success: Boolean
    errorMessages: [String]
    data: GauntletResponse
  }
`;
