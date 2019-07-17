import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/page/Main'

import Echarts01 from '@/components/views/echartsExamples/Echarts01.vue'//echarts样例

// 绩效
import ShopBis from '@/components/views/bis/ShopBis.vue'//店铺
import GoodsBis from '@/components/views/bis/GoodsBis.vue'//商品
import ScoreBis from '@/components/views/bis/ScoreBis.vue'//绩效
import IndexBis from '@/components/views/bis/IndexBis.vue'//首页
import NoticeBis from '@/components/views/bis/NoticeBis.vue'//E店宝后台_系统公告
import Reauthorization from '@/components/views/bis/children/Reauthorization.vue'//查看更多店铺
import HistoryPage from '@/components/views/bis/children/HistoryPage.vue'//历史公告
import SubjectContent from '@/components/views/bis/children/SubjectContent.vue'//历史公告
import SystemUpdate from '@/components/views/bis/children/SystemUpdate.vue'//系统更新
import UpdateDetail from '@/components/views/bis/children/UpdateDetail.vue'//系统更新内容

// 登录
import TestLogin from '@/components/views/TestLogin.vue'
import InitRouter from '@/components/views/InitRouter.vue'

Vue.use(Router);

export default new Router({
  /*mode:'history',*/
  scrollBehavior: ()=>({y:0}),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      component: Main,
      children:[
        //Index
        {
          path: '/',
          redirect: '/initRouter'
        },
        {
          path: '/initRouter',
          component: InitRouter
        },
        {
          path:'/testLogin',
          component:TestLogin
        },
        //报表
        {
          path: '/shopBis',
          component: ShopBis
        },
        {
          path: '/goodsBis',
          component: GoodsBis
        },
        {
          path: '/scoreBis',
          component: ScoreBis
        },
        {
          path: '/indexBis',
          component: IndexBis
        },
        {
          path: '/noticeBis',
          component: NoticeBis
        },

        //echarts样例
        {
          path:'/echarts01',
          component:Echarts01
        },
        {
          path:'/reauthorization',
          component:Reauthorization
        },
        {
          path:'/historyPage',
          component:HistoryPage
        },//系统公告
        {
          path:'/subjectContent/:id',
          component:SubjectContent,//系统公告内容
          name: 'SubjectContent'
        },
        {
          path:'/systemUpdate',
          component:SystemUpdate//系统更新
        },
        {
          path:'/updateDetail/:id',
          component:UpdateDetail,//系统更新内容
          name: 'UpdateDetail'
        }//
      ]
    }
  ]
})
