import Urls from '@/constants/urls';
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
