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
      limit
      isSeeded
    }
    rulesSeries {
      id
      name
    }
  }
`;

const getHTRTemplatesByType = gql`
  query getHTRTemplatesByType(
    $search: String
    $type: HTRTemplateType!
    $paging: Paging
  ) {
    htrTemplatesPaged(search: $search, type: $type, paging: $paging) {
      nodes {
        id
        name
        type
        rules {
          isSeeded
        }
      }
      total
      hasMore
    }
  }
`;

const getHTRTemplatesByTypeForAutocomplete = gql`
  query getHTRTemplatesByTypeForAutocomplete(
    $search: String
    $type: HTRTemplateType!
  ) {
    htrTemplates(search: $search, type: $type) {
      id
      name
      type
      rules {
        genders
        series
        sources
        limit
        isSeeded
      }
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
    getHTRTemplatesByTypeForAutocomplete,
    getHTRTemplateById
  },
  mutation: {
    updateHTRTemplate,
    createHTRTemplate
  }
};
