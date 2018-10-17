export default Object.freeze({
  left: 'left',
  right: 'right',
  center: 'center',
  portal: {
    modal: 'htr-backdrop-portal',
    actions: 'htr-action-portal',
    naviMenu: 'htr-navi-menu-portal',
    backButton: 'htr-back-portal'
  },
  localStorageKey: 'htr-settings',
  // input types
  text: 'text',
  checkbox: 'checkbox',
  date: 'date',
  // data types
  object: 'object',
  string: 'string',
  number: 'number',
  missing: {
    series: 'No series linked.',
    tags: 'No tags linked'
  },
  route: {
    base: 'home',
    characterList: 'characters',
    characterView: 'character view',
    characterCreate: 'character create',
    seriesList: 'series list',
    seriesView: 'series view',
    seriesCreate: 'series create',
    versusComparison: 'versus comparison',
    versusCreator: 'versus creator',
    htrTemplateList: 'htr template list',
    htrTemplateCreator: 'htr template creator',
    htrTemplateEditor: 'htr template editor',
    htrInstanceList: 'htr instance list',
    htrInstanceView: 'htr instance view',
    htrInstanceCreate: 'htr instance create'
  },
  slot: {
    viewBlock: 'view-block__read-only',
    listFilterType: 'list-filter__type'
  },
  events: {
    click: 'click'
  },
  monthNames: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
});
