module.exports = `
type Query {
  examples: [Example]

  characters(search: String): [Character]
  character(id: Int!): Character
}
`;
