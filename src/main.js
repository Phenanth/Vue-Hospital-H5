// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Base from './base';

Vue.config.productionTip = false
Vue.use(Element)
Vue.use(Base)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
