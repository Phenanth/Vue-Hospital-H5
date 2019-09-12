import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'

import Query from '@/components/Query'
import Submit from '@/components/Submit'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/query'
    }, 
    {
      path: '/query',
      name: 'Query',
      component: Query
    },
    {
      path: '/submit',
      name: 'Submit',
      component: Submit
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
});

export default router;
