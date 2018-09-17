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
      }
      order
      status
      layout
      winnerId
    }
  }
`;

const existingInstanceFields = gql`
  ${instanceFields}
  fragment ExistingInstanceFields on HTRInstance {
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
      ...ExistingInstanceFields
    }
  }
  ${existingInstanceFields}
`;

const updateHTRInstance = gql`
  mutation updateHTRInstance($instance: HTRInstanceInput) {
    htrInstanceUpdate(instance: $instance) {
      ...ExistingInstanceFields
    }
  }
  ${existingInstanceFields}
`;

const createHTRInstance = gql`
  mutation createHTRInstance($instance: HTRInstanceInput) {
    htrInstanceCreate(instance: $instance) {
      ...InstanceFields
    }
  }
  ${instanceFields}
`;

const castVoteInBracket = gql`
  query castVoteInBracket(
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
    }
  }
  ${instanceFields}
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
