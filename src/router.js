import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import Urls from '@/constants/urls';
import Strings from '@/constants/strings';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: Strings.route.base }
    },
    {
      path: Urls.base,
      name: Strings.route.base,
      component: Home
    },
    {
      path: Urls.characterList,
      name: Strings.route.characterList,
      component: () =>
        import(/* webpackChunkName: "characters-list" */ './views/Characters/CharactersList.vue')
    },
    {
      path: Urls.characterView,
      name: Strings.route.characterView,
      component: () =>
        import(/* webpackChunkName: "characters-view" */ './views/Characters/CharactersView.vue'),
      props: { isCreate: false }
    },
    {
      path: Urls.characterCreate,
      name: Strings.route.characterCreate,
      component: () =>
        import(/* webpackChunkName: "characters-view" */ './views/Characters/CharactersView.vue'),
      props: { isCreate: true }
    },
    {
      path: Urls.seriesList,
      name: Strings.route.seriesList,
      component: () =>
        import(/* webpackChunkName: "series-list" */ './views/Series/SeriesList.vue')
    },
    {
      path: Urls.seriesView,
      name: Strings.route.seriesView,
      component: () =>
        import(/* webpackChunkName: "series-view" */ './views/Series/SeriesView.vue'),
      props: { isCreate: false }
    },
    {
      path: Urls.seriesCreate,
      name: Strings.route.seriesCreate,
      component: () =>
        import(/* webpackChunkName: "series-view" */ './views/Series/SeriesView.vue'),
      props: { isCreate: true }
    },
    {
      path: Urls.versusComparison,
      name: Strings.route.versusComparison,
      component: () =>
        import(/* webpackChunkName: "versus-comparison" */ './views/Versus/VersusComparison.vue')
    }
  ]
});
