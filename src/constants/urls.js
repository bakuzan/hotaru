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
  }
};

export default Urls;
