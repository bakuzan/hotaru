import gql from 'graphql-tag';

const templateFields = gql`
  fragment TemplateFields on HTRTemplate {
    id
    name
    type
    rules {
      genders
      series
      sources
    }
  }
`;

const getHTRTemplatesByType = gql`
  query getHTRTemplatesByType($search: String, $type: HTRTemplateType!) {
    htrTemplates(search: $search, type: $type) {
      id
      name
      type
    }
  }
`;

const getHTRTemplateById = gql`
  query getHTRTemplateById($id: Int!) {
    htrTemplateById(id: $id) {
      ...TemplateFields
    }
  }
  ${templateFields}
`;

const updateHTRTemplate = gql`
  mutation updateHTRTemplate($template: HTRTemplateUpdateInput) {
    htrTemplateUpdate(template: $template) {
      ...TemplateFields
    }
  }
  ${templateFields}
`;

const createHTRTemplate = gql`
  mutation createHTRTemplate($template: HTRTemplateInput) {
    htrTemplateCreate(template: $template) {
      ...TemplateFields
    }
  }
  ${templateFields}
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
