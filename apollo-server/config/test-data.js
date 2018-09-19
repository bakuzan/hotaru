const series = [
  {
    name: 'Dagashi Kashi',
    source: 'Manga',
    displayImage: 'https://i.imgur.com/31pFAEr.jpg'
  },
  {
    name: 'Witchcraft Works',
    source: 'Manga',
    displayImage: 'https://i.imgur.com/4z68zvZ.jpg'
  },
  {
    name: 'Prison School',
    source: 'Manga',
    displayImage: 'https://i.imgur.com/Jc634zq.jpg'
  },
  {
    name: 'Kill La Kill',
    source: 'Anime',
    displayImage: 'https://i.imgur.com/THrUQKx.jpg'
  },
  {
    name: 'Berserk',
    source: 'Manga',
    displayImage: 'https://i.imgur.com/2jAkUoE.jpg'
  },
  {
    name: 'Noragami',
    source: 'Manga',
    displayImage: 'https://i.imgur.com/6d9G2Ar.jpg'
  },
  {
    name: 'Star Wars',
    source: 'Movie',
    displayImage: 'https://i.imgur.com/SeDH9Qm.jpg'
  }
];
const characters = [
  {
    name: 'Shidare Hotaru',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/jLwdACg.jpg',
    isWaifu: false
  },
  {
    name: 'Kagari Ayaka',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/3xdrczj.jpg',
    isWaifu: true
  },
  {
    name: 'Shiraki Meiko',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/5hLv07N.jpg',
    isWaifu: true
  },
  {
    name: 'Kurihara Mari',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/3BeLYsy.jpg',
    isWaifu: false
  },
  {
    name: 'Kiryuin Satsuki',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/hwpbszY.jpg',
    isWaifu: false
  },
  {
    name: 'Kiryuin Ragyo',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/xRWCpHW.jpg',
    isWaifu: false
  },
  {
    name: 'Matoi Ryuuko',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/Gq8ulAp.jpg',
    isWaifu: false
  },
  {
    name: 'Guts',
    gender: 'Male',
    displayImage: 'https://i.imgur.com/0c3p5VT.jpg',
    isWaifu: false
  },
  {
    name: 'Joseph Joestar',
    gender: 'Male',
    displayImage: 'https://i.imgur.com/0jtjOQD.jpg',
    isWaifu: false
  },
  {
    name: 'Darth Vader',
    gender: 'Male',
    displayImage: 'https://i.imgur.com/EHFqL3C.jpg',
    isWaifu: false
  },
  {
    name: 'Bishamonten',
    gender: 'Female',
    displayImage: 'https://i.imgur.com/NTkNb9T.jpg',
    isWaifu: false
  }
];
const tags = [
  { name: 'teenager' },
  { name: 'witch' },
  { name: 'student council' },
  { name: 'glasses' },
  { name: 'thigh-highs' },
  { name: 'mask' }
];
const templates = [
  {
    name: 'Free Test',
    type: 'List',
    rules: {
      genders: [],
      sources: [],
      series: []
    }
  },
  {
    name: 'Only Female Test',
    type: 'List',
    rules: {
      genders: ['Female'],
      sources: [],
      series: []
    }
  },
  {
    name: 'Only Anime Test',
    type: 'List',
    rules: {
      genders: [],
      sources: ['Anime'],
      series: []
    }
  },
  {
    name: 'Free Test',
    type: 'Bracket',
    rules: {
      genders: [],
      sources: [],
      series: []
    }
  },
  {
    name: 'Only Female Bracket',
    type: 'Bracket',
    rules: {
      genders: ['Female'],
      sources: [],
      series: []
    }
  },
  {
    name: 'Only Anime Bracket',
    type: 'Bracket',
    rules: {
      genders: [],
      sources: ['Anime'],
      series: []
    }
  }
];

module.exports = {
  series,
  characters,
  tags,
  templates
};
