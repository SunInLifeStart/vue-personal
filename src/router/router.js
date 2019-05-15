import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

let routes = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/portal'
    },
    {
      path: '/profile',
      name: '个人资料' ,
      component: () => import('../views/Profile')
    },
    {
      path: '/home/:type',
      name: '中关村协同发展',
      component: () => import('../views/Home.vue'),
      props: true
    }, {
      path: '/webim',
      name: '即时通讯',
      component: () => import('../views/WebIm')
    }
    , {
      path: '/docs',
      name: '文库',
      component: () => import('../views/Docs')
    },
     {
      path: '/publicforum',
      name: '交流园地',
      component: () => import('../views/PublicForum')
    }, {
      path: '/filestore/:type',
      name: '云盘',
      component: () => import('../views/FileStore'),
      props: true
    }, {
      path: '/search/:key',
      name: '搜索结果',
      component: () => import('../views/SearchResult')
    },
    {
      path: '/apps/:appname',
      component: () => import('../views/Apps.vue'),
      props: true
    },
    {
      path: '/apps/:appname/:formId',
      component: () => import('../views/AppDetail.vue'),
      props: true
    },
    {
      path: '/portal',
      component: () => import('../views/portal/Portal.vue')
    },
    {
      path: '/portal/list/:type/:page',
      component: () => import('../views/portal/List.vue'),
      props: true
    },
    {
      path: '/portal/list/:type/:page/:id',
      component: () => import('../views/portal/Details.vue'),
      props: true
    },
    {
      path: '/portal/list2',
      component: () => import('../views/portal/List2.vue'),
      props: true
    },
    {
      path: '/leader',
      name: '领导驾驶舱',
      component: () => import('../views/Leader')
    },
    {
      path: '/flowtest',
      name: '流程测试',
      component: () => import('../views/flowTest')
    },
  ]
});

export default routes;
