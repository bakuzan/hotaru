import Urls from '@/constants/urls';
import { BracketStatuses } from '@/constants/bracket-status';
import { generateUniqueId } from '@/utils';

export const defaultCharacterModel = () => ({
  name: '',
  displayImage: null,
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
  isIncludeOnlySource: false
});

export const defaultHTRTemplate = () => ({
  name: '',
  type: null,
  rules: {
    genders: [],
    series: [],
    sources: []
  }
});

export const defaultInstanceModel = () => ({
  name: '',
  description: '',
  htrTemplate: null,
  settings: {
    limit: null,
    order: 1,
    status: BracketStatuses.notstarted,
    rules: {}
  }
});
