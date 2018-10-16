import Urls from '@/constants/urls';
import { HTRTemplateTypes } from '@/constants/htr-template-type';
import { generateUniqueId } from '@/utils';

export const defaultCharacterModel = () => ({
  name: '',
  displayImage: null,
  isWaifu: false,
  gender: null,
  seriesId: null,
  tagIds: [],
  images: []
});

export const defaultSeriesModel = () => ({
  name: '',
  displayImage: null,
  source: null,
  characters: []
});

export const createDummyCharacterCompare = () => {
  return {
    id: generateUniqueId(),
    displayImage: Urls.images.characterPlaceholder,
    ranking: {}
  };
};

export const versusCreatorDefaultRules = () => ({
  genders: [],
  series: [],
  sources: [],
  isIncludeOnlyGender: false,
  isIncludeOnlySeries: false,
  isIncludeOnlySource: false,
  hasNoVersusOnly: false
});

export const defaultHTRTemplate = () => ({
  name: '',
  type: null,
  rules: {
    genders: [],
    series: [],
    sources: [],
    limit: null
  }
});

export const defaultInstanceModel = (type) => ({
  name: '',
  description: '',
  htrTemplate: null,
  characters: [],
  versus: [],
  settings: {
    limit: null,
    rules: {},
    ...(type === HTRTemplateTypes.list ? { order: 1 } : {})
  }
});

export const defaultPagedResponse = () => ({
  nodes: [],
  total: 0,
  hasMore: true
});
