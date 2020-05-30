const Urls = {
  build: (path, params) => {
    for (let k in params) {
      if (params.hasOwnProperty(k)) {
        path = path.replace(`:${k}`, params[k]);
      }
    }
    return path;
  },
  images: {
    deadImage: 'https://i.imgur.com/gKr1YhF.png',
    characterPlaceholder: 'https://i.imgur.com/VYw06nf.jpg'
  },
  get characterList() {
    return `/characters`;
  },
  get characterView() {
    return `${this.characterList}/view/:id`;
  },
  get characterCreate() {
    return `${this.characterList}/create`;
  },
  get seriesList() {
    return `/series`;
  },
  get seriesView() {
    return `${this.seriesList}/view/:id`;
  },
  get seriesCreate() {
    return `${this.seriesList}/create`;
  },
  get versusComparison() {
    return `/versus/compare`;
  },
  get versusCreator() {
    return `/versus/creator`;
  },
  get htrTemplateList() {
    return `/templates`;
  },
  get htrTemplateCreator() {
    return `${this.htrTemplateList}/creator`;
  },
  get htrTemplateEditor() {
    return `${this.htrTemplateCreator}/:id`;
  },
  get htrInstanceList() {
    return `/instances`;
  },
  get htrInstanceView() {
    return `${this.htrInstanceList}/view/:type/:id`;
  },
  get htrInstanceCreate() {
    return `${this.htrInstanceList}/create/:type`;
  },
  get htrInstanceLeagueCenter() {
    return `/leagues`;
  },
  get htrInstanceLeagueView() {
    return `${this.htrInstanceLeagueCenter}/:seasonId`;
  },
  get rankingList() {
    return `/rankings`;
  },
  get gauntlet() {
    return `/gauntlet`;
  }
};

export default Urls;
