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
      component: Query,
      children: [
        // 不知道是否有必要将查询页面的URL改为这种格式以用于获得税号进行后续查询
        {
          path: '/query/:taxCode',
          component: Query
        }
      ]
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
