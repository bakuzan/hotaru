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
    characterPlaceholder: 'https://i.imgur.com/bW0heWj.jpg'
  },
  base: '/hotaru',
  get characterList() {
    return `${this.base}/characters`;
  },
  get characterView() {
    return `${this.characterList}/view/:id`;
  },
  get characterCreate() {
    return `${this.characterList}/create`;
  },
  get seriesList() {
    return `${this.base}/series`;
  },
  get seriesView() {
    return `${this.seriesList}/view/:id`;
  },
  get seriesCreate() {
    return `${this.seriesList}/create`;
  },
  get versusComparison() {
    return `${this.base}/versus/compare`;
  },
  get versusCreator() {
    return `${this.base}/versus/creator`;
  },
  get htrTemplateList() {
    return `${this.base}/templates`;
  },
  get htrTemplateCreator() {
    return `${this.htrTemplateList}/creator`;
  },
  get htrTemplateEditor() {
    return `${this.htrTemplateCreator}/:id`;
  },
  get htrInstanceList() {
    return `${this.base}/instances`;
  },
  get htrInstanceView() {
    return `${this.htrInstanceList}/view/:id`;
  },
  get htrInstanceCreate() {
    return `${this.htrInstanceList}/create/:type`;
  }
};

export default Urls;
