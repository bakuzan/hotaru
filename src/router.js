import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import Urls from '@/constants/urls';
import Strings from '@/constants/strings';
import { capitaliseEachWord } from '@/utils';

Vue.use(Router);

const htrRouter = new Router({
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
    },
    {
      path: Urls.versusCreator,
      name: Strings.route.versusCreator,
      component: () =>
        import(/* webpackChunkName: "versus-creator" */ './views/Versus/VersusCreator.vue')
    },
    {
      path: Urls.htrTemplateList,
      name: Strings.route.htrTemplateList,
      component: () =>
        import(/* webpackChunkName: "template-list" */ './views/HTRTemplates/HTRTemplateList.vue')
    },
    {
      path: Urls.htrTemplateCreator,
      name: Strings.route.htrTemplateCreator,
      component: () =>
        import(/* webpackChunkName: "htr-template-creator" */ './views/HTRTemplates/HTRTemplateCreator.vue'),
      props: { isCreate: true }
    },
    {
      path: Urls.htrTemplateEditor,
      name: Strings.route.htrTemplateEditor,
      component: () =>
        import(/* webpackChunkName: "htr-template-creator" */ './views/HTRTemplates/HTRTemplateCreator.vue'),
      props: { isCreate: false }
    },
    {
      path: Urls.htrInstanceList,
      name: Strings.route.htrInstanceList,
      component: () =>
        import(/* webpackChunkName: "instance-list" */ './views/HTRInstances/HTRInstanceList.vue')
    },
    {
      path: Urls.htrInstanceCreate,
      name: Strings.route.htrInstanceCreate,
      component: () =>
        import(/* webpackChunkName: "instance-view" */ './views/HTRInstances/HTRInstanceView.vue'),
      props: { isCreate: true }
    },
    {
      path: Urls.htrInstanceView,
      name: Strings.route.htrInstanceView,
      component: () =>
        import(/* webpackChunkName: "instance-view" */ './views/HTRInstances/HTRInstanceView.vue'),
      props: { isCreate: false }
    },
    {
      path: Urls.htrInstanceLeagueCenter,
      name: Strings.route.htrInstanceLeagueCenter,
      component: () =>
        import(/* webpackChunkName: "instance-league-center" */ './views/HTRInstances/HTRInstanceLeagueCenter.vue')
    },
    {
      path: Urls.htrInstanceLeagueView,
      name: Strings.route.htrInstanceLeagueView,
      component: () =>
        import(/* webpackChunkName: "instance-league-view" */ './views/HTRInstances/HTRInstanceLeagueView.vue')
    },
    {
      path: Urls.rankingList,
      name: Strings.route.rankingList,
      component: () =>
        import(/* webpackChunkName: "ranking-list" */ './views/Rankings/RankingsList.vue')
    },
    {
      path: '*',
      name: Strings.route.pageNotFound,
      component: () =>
        import(/* webpackChunkName: "page-not-found" */ './views/PageNotFound.vue')
    }
  ]
});

export default htrRouter;
