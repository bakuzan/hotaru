import gql from 'graphql-tag';

const getHTRTemplatesByType = gql`
  query getHTRTemplatesByType($search: String, $type: HTRTemplateType!) {
    htrTemplates(search: $search, type: $type) {
      id
      name
      type
      rules
    }
  }
`;

const getHTRTemplateById = gql`
  query getHTRTemplateById($id: Int!) {
    htrTemplateById(id: $id) {
      id
      name
      type
      rules
    }
  }
`;

const updateHTRTemplate = gql`
  mutation updateHTRTemplate($template: HTRTemplateUpdateInput) {
    htrTemplateUpdate(template: $template) {
      id
      name
      type
      rules
    }
  }
`;

const createHTRTemplate = gql`
  mutation createHTRTemplate($template: HTRTemplateInput) {
    htrTemplateCreate(template: $template) {
      id
      name
      type
      rules
    }
  }
`;

export default {
  query: {
    getHTRTemplatesByType,
    getHTRTemplateById
  },
  mutation: {
    updateHTRTemplate,
    createHTRTemplate
  }
};
