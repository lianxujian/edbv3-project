import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/Login'], resolve)
    },
    {
      path: '/Layout',
      name: 'Layout',
      component: resolve => require(['@/components/Layout'], resolve)
    },
    {
      path: '/authorityGroup',
      name: 'authorityGroup',
      component: resolve => require(['@/views/authorityConfig/authorityGroup'], resolve)
    },
    {
      path: '/authorityMange',
      name: 'authorityMange',
      component: resolve => require(['@/views/authorityConfig/authorityMange'], resolve)
    },
    {
      path: '/company',
      name: 'company',
      component: resolve => require(['@/views/authorityConfig/company'], resolve)
    },
    {
      path: '/department',
      name: 'department',
      component: resolve => require(['@/views/authorityConfig/department'], resolve)
    },
    {
      path: '/staffManage',
      name: 'staffManage',
      component: resolve => require(['@/views/authorityConfig/staffManage'], resolve)
    },
    {
      path: '/safetyConfig',
      name: 'safetyConfig',
      component: resolve => require(['@/views/windControl/safetyConfig'], resolve)
    },
    {
      path: '/loginLog',
      name: 'loginLog',
      component: resolve => require(['@/views/windControl/loginLog'], resolve)
    },
    {
      path: '/windConfig',
      name: 'windConfig',
      component: resolve => require(['@/views/windControl/windConfig'], resolve)
    },
    {
      path: '/blacklist',
      name: 'blacklist',
      component: resolve => require(['@/views/windControl/blacklist'], resolve)
    },
    { path: '*', redirect: '/login'}
  ]
})
