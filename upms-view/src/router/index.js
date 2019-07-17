import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
 /* mode:'history',*/
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/Login'], resolve)
    },
    {
      path: '/phonePage',
      name: 'phonePage',
      component: resolve => require(['@/components/phonePage'], resolve)
    },
    {
      path: '/findPassword',
      name: 'findPassword',
      component: resolve => require(['@/components/FindPassword'], resolve) // 找回密码
    },
     {
       path: '/setupPassword/:loginName',
       name: 'setupPassword',
       component: resolve => require(['@/components/setupPassword'], resolve) // 设置新密码
     },
    {
      path: '/activateAccount/:loginName/:companyId',
      name: 'activateAccount',
      component: resolve => require(['@/components/ActivateAccount'], resolve) // 激活账号
    },
    {
      path: '/personalCenter',
      name: 'personalCenter',
      component: resolve => require(['@/components/PersonalCenter'], resolve) // 个人中心
    },
    {
      path: '/upmsIndex',
      name: 'upmsIndex',
      component: resolve => require(['@/components/UpmsIndex'], resolve) // upms首页
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
    {
      path: '/account',
      name: 'account',
      component: resolve => require(['@/views/setUp/account'], resolve) //账号
    },
    {
      path: '/department1',
      name: 'department1',
      component: resolve => require(['@/views/setUp/department'], resolve) // 部门
    },
    {
      path: '/role',
      name: 'role',
      component: resolve => require(['@/views/setUp/role'], resolve) // 角色
    },
    {
      path: '/addRole',
      name: 'addRole',
      component: resolve => require(['@/views/setUp/children/addRole'], resolve) // 设置角色权限
    },
    {
      path: '/amendRole/:privilegegroupName/:privilegegroupId',
      name: 'amendRole',
      component: resolve => require(['@/views/setUp/children/amendRole'], resolve) // 修改角色权限
    },
    {
      path: '/setupQ/:userId',
      name: 'setupQ',
      component: resolve => require(['@/views/setUp/children/setupQ'], resolve) // 账号设置权限
    }
  ]
})
