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
    characters {
      id
      name
      displayImage
      ranking {
        rank
      }
    }
    versus {
      id
      characters {
        id
        name
        displayImage
        ranking {
          rank
        }
      }
      winnerId
    }
  }
`;

const getHTRInstancesByType = gql`
  query getHTRInstancesByType($search: String, $type: HTRTemplateType!) {
    htrInstances(search: $search, type: $type) {
      id
      name
      description
    }
  }
`;

const getHTRInstanceById = gql`
  query getHTRInstanceById($id: Int!) {
    htrInstanceById(id: $id) {
      ...InstanceAndAssociationFields
    }
  }
  ${instanceAndAssociationFields}
`;

const updateHTRInstance = gql`
  mutation updateHTRInstance($instance: HTRInstanceInput) {
    htrInstanceUpdate(instance: $instance) {
      ...InstanceAndAssociationFields
    }
  }
  ${instanceAndAssociationFields}
`;

const createHTRInstance = gql`
  mutation createHTRInstance($instance: HTRInstanceInput) {
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
