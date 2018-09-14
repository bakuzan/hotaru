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
  }
  ${instanceFields}
`;

const updateHTRInstance = gql`
  mutation updateHTRInstance($instance: HTRInstanceInput) {
    htrInstanceUpdate(instance: $instance) {
      ...InstanceFields
    }
  }
  ${instanceFields}
`;

const createHTRInstance = gql`
  mutation createHTRInstance($instance: HTRInstanceInput) {
    htrInstanceCreate(instance: $instance) {
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
    createHTRInstance
  }
};
