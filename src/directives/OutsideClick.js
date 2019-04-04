import Vue from 'vue';

import addOutsideClick from '../utils/addOutsideClick';

export const OutsideClick = {
  acceptStatement: true,
  bind(element, binding, vnode) {
    const vm = vnode.context;
    vm.removeOutsideClick = addOutsideClick(element, binding.value);
  },
  unbind(_, __, vnode) {
    const vm = vnode.context;
    vm.removeOutsideClick && vm.removeOutsideClick();
  }
};

Vue.directive('htr-outside-click', OutsideClick);
