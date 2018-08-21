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
    deadImage: 'https://i.imgur.com/gKr1YhF.png'
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
  }
};

export default Urls;
