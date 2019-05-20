import gql from 'graphql-tag';

const instanceFields = gql`
  fragment InstanceFields on HTRInstance {
    id
    name
    description
    htrTemplate {
      id
      name
      type
    }
    settings {
      limit
      rules {
        genders
        sources
        series
        isSeeded
      }
      order
      customOrder
      seedOrder
      status
      layout
      winnerId
    }
  }
`;

const instanceCharacterFields = gql`
  fragment InstanceCharacterFields on Character {
    id
    name
    displayImage
  }
`;

const instanceVersusFields = gql`
  fragment InstanceVersusFields on Versus {
    id
    characters {
      id
      name
      displayImage
    }
    winnerId
  }
`;

const getHTRInstancesByType = gql`
  query getHTRInstancesByType(
    $search: String
    $type: HTRTemplateType!
    $paging: Paging
  ) {
    htrInstancesPaged(search: $search, type: $type, paging: $paging) {
      nodes {
        id
        name
        description
        htrTemplate {
          id
          type
        }
        settings {
          rules {
            isSeeded
          }
          winnerId
        }
        createdAt
      }
      total
      hasMore
    }
  }
`;

const getHTRInstanceById = gql`
  query getHTRInstanceById($id: Int!, $withCharacters: Boolean!) {
    htrInstanceById(id: $id) {
      ...InstanceFields
      characters @include(if: $withCharacters) {
        ...InstanceCharacterFields
      }
      versus @skip(if: $withCharacters) {
        ...InstanceVersusFields
      }
    }
  }
  ${instanceFields}
  ${instanceCharacterFields}
  ${instanceVersusFields}
`;

const updateHTRInstance = gql`
  mutation updateHTRInstance(
    $instance: HTRInstanceInput
    $withCharacters: Boolean!
  ) {
    htrInstanceUpdate(instance: $instance) {
      ...InstanceFields
      characters @include(if: $withCharacters) {
        ...InstanceCharacterFields
      }
      versus @skip(if: $withCharacters) {
        ...InstanceVersusFields
      }
    }
  }
  ${instanceFields}
  ${instanceCharacterFields}
  ${instanceVersusFields}
`;

const createHTRInstance = gql`
  mutation createHTRInstance(
    $instance: HTRInstanceInput
    $withCharacters: Boolean!
  ) {
    htrInstanceCreate(instance: $instance) {
      ...InstanceFields
      characters @include(if: $withCharacters) {
        ...InstanceCharacterFields
      }
      versus @skip(if: $withCharacters) {
        ...InstanceVersusFields
      }
    }
  }
  ${instanceFields}
  ${instanceCharacterFields}
  ${instanceVersusFields}
`;

const castVoteInBracket = gql`
  mutation castVoteInBracket(
    $htrInstanceId: Int!
    $versusId: Int!
    $winnerId: Int!
  ) {
    htrInstanceVersusVote(
      htrInstanceId: $htrInstanceId
      versusId: $versusId
      winnerId: $winnerId
    ) {
      ...InstanceFields
      versus {
        ...InstanceVersusFields
      }
    }
  }
  ${instanceFields}
  ${instanceVersusFields}
`;

export default {
  query: {
    getHTRInstancesByType,
    getHTRInstanceById
  },
  mutation: {
    updateHTRInstance,
    createHTRInstance,
    castVoteInBracket
  }
};
