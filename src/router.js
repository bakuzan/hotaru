import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import Urls from '@/constants/urls';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: Urls.base,
      name: 'home',
      component: Home
    },
    {
      path: Urls.characterList,
      name: 'characters',
      component: () =>
        import(/* webpackChunkName: "characters-list" */ './views/Characters/CharactersList.vue')
    },
    {
      path: Urls.characterView,
      name: 'character view',
      component: () =>
        import(/* webpackChunkName: "characters-view" */ './views/Characters/CharactersView.vue')
    }
  ]
});
