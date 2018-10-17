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

const instanceAndAssociationFields = gql`
  ${instanceFields}
  fragment InstanceAndAssociationFields on HTRInstance {
    ...InstanceFields
    characters @include(if: $withCharacters) {
      id
      name
      displayImage
      ranking {
        rank
      }
    }
    versus @skip(if: $withCharacters) {
      id
      characters {
        id
        name
        displayImage
      }
      winnerId
    }
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
      ...InstanceAndAssociationFields
    }
  }
  ${instanceAndAssociationFields}
`;

const updateHTRInstance = gql`
  mutation updateHTRInstance(
    $instance: HTRInstanceInput
    $withCharacters: Boolean!
  ) {
    htrInstanceUpdate(instance: $instance) {
      ...InstanceAndAssociationFields
    }
  }
  ${instanceAndAssociationFields}
`;

const createHTRInstance = gql`
  mutation createHTRInstance(
    $instance: HTRInstanceInput
    $withCharacters: Boolean!
  ) {
    htrInstanceCreate(instance: $instance) {
      ...InstanceAndAssociationFields
    }
  }
  ${instanceAndAssociationFields}
`;

const castVoteInBracket = gql`
  mutation castVoteInBracket(
    $htrInstanceId: Int!
    $versusId: Int!
    $winnerId: Int!
    $withCharacters: Boolean!
  ) {
    htrInstanceVersusVote(
      htrInstanceId: $htrInstanceId
      versusId: $versusId
      winnerId: $winnerId
    ) {
      ...InstanceAndAssociationFields
    }
  }
  ${instanceAndAssociationFields}
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
