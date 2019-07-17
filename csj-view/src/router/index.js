import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/page/Main'
import Index from '@/components/views/Index'

/*/!* 商品 *!/
import goodsManage from '@/components/views/goods/GoodsManage'
 import goodsAdd from '@/components/views/goods/children/GoodsAdd'
import goodsRelease from '@/components/views/goods/GoodsRelease'

/!*极限词检测*!/
import limitDetection from '@/components/views/limitword/LimitDetection'
import limitwordCare from '@/components/views/limitword/LimitwordCare'
import historyRecord from '@/components/views/limitword/HistoryRecord'

/!* 任务中心 *!/
import taskCenter from '@/components/views/task/TaskCenter'
 import taskDetail from '@/components/views/task/children/DownLoadDetail'

/!* 计费管理 *!/
import accountCenter from '@/components/views/billingManage/accountCenter'
import consDetail from '@/components/views/billingManage/consDetail'
import rechargeRecord from '@/components/views/billingManage/rechargeRecord'
import payPage from '@/components/views/billingManage/payPage'

/!* 设置 *!/
import accountSetting from '@/components/views/setting/accountSetting'
import storeSetting from '@/components/views/setting/storeSetting'
import paramsSetting from '@/components/views/setting/paramsSetting'

/!* 首页 *!/
import home from '@/components/views/home/home'
import noticeDetail from '@/components/views/home/noticeDetail'
import notice from '@/components/views/home/notice'

/!* 后台管理 *!/
import accountManage from '@/components/views/backStageList/accountManage'
import billingDetails from '@/components/views/backStageList/billingDetails'
import noticeInfo from '@/components/views/backStageList/noticeInfo'
import rechargeManage from '@/components/views/backStageList/rechargeManage'
import backRechargeRecord from '@/components/views/backStageList/rechargeRecord'
import service from '@/components/views/backStageList/service'*/

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
      component: resolve => require(['@/components/page/Main'], resolve),
      children:[
        {
          path: '/',
          redirect: '/index'
        },
        {
          path:'/index',
          component:resolve => require(['@/components/views/Index'], resolve)
        },
        //商品
        {
          path:'/goodsManage',
          component:resolve => require(['@/components/views/goods/GoodsManage'], resolve)
        },
        {
          path:'/goodsAdd/:tsGoodsId/:source',
          component:resolve => require(['@/components/views/goods/children/GoodsAdd'], resolve)
        },
        {
          path:'/goodsRelease',
          component:resolve => require(['@/components/views/goods/GoodsRelease'], resolve)
        },
        //极限词检测
        {
          path:'/limitDetection/:goodsIds',
          component:resolve => require(['@/components/views/limitword/LimitDetection'], resolve)
        },
        {
          path:'/limitwordCare',
          component:resolve => require(['@/components/views/limitword/LimitwordCare'], resolve)
        },
        {
          path:'/historyRecord',
          component:resolve => require(['@/components/views/limitword/HistoryRecord'], resolve)
        },
        //任务中心
        {
          path:'/taskCenter',
          component:resolve => require(['@/components/views/task/TaskCenter'], resolve)
        },
        {
          path:'/taskDetail/:taskId',
          component:resolve => require(['@/components/views/task/children/DownloadDetail'], resolve)
        },
        //计费管理
        {
          path:'/accountCenter',
          component:resolve => require(['@/components/views/billingManage/accountCenter'], resolve)
        },
        {
          path:'/consDetail',
          component:resolve => require(['@/components/views/billingManage/consDetail'], resolve)
        },
        {
          path:'/rechargeRecord',
          component:resolve => require(['@/components/views/billingManage/rechargeRecord'], resolve)
        },
        {
          path:'/payPage/:payPath/:payNum',
          component:resolve => require(['@/components/views/billingManage/payPage'], resolve)
        },
        {
          path: '/payDone',
          component: resolve => require(['@/components/views/billingManage/payDone'], resolve)
        },
        //设置
        {
          path:'/accountSetting',
          component:resolve => require(['@/components/views/setting/accountSetting'], resolve)
        },
        {
          path:'/storeSetting',
          component:resolve => require(['@/components/views/setting/storeSetting'], resolve)
        },
        {
          path:'/paramsSetting',
          component:resolve => require(['@/components/views/setting/paramsSetting'], resolve)
        },
        //首页
        {
          path:'/home',
          component:resolve => require(['@/components/views/home/home'], resolve)
        },
        {
          path:'/noticeDetail',
          component:resolve => require(['@/components/views/home/noticeDetail'], resolve)
        },
        {
          path:'/notice/:noticeId',
          component:resolve => require(['@/components/views/home/notice'], resolve)
        },
        //后台管理
        {
          path:'/accountManage',
          component:resolve => require(['@/components/views/backStageList/accountManage'], resolve)
        },
        {
          path:'/billingDetails',
          component:resolve => require(['@/components/views/backStageList/billingDetails'], resolve)
        },
        {
          path:'/noticeInfo',
          component:resolve => require(['@/components/views/backStageList/noticeInfo'], resolve)
        },
        {
          path:'/rechargeManage',
          component:resolve => require(['@/components/views/backStageList/rechargeManage'], resolve)
        },
        {
          path:'/backRechargeRecord',
          component:resolve => require(['@/components/views/backStageList/rechargeRecord'], resolve)
        },
        {
          path:'/service',
          component:resolve => require(['@/components/views/backStageList/service'], resolve)
        },
      ]
    }
  ]
})
