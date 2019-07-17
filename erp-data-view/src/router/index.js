import Vue from 'vue'
import Router from 'vue-router'
const Main = resolve => require(['@/components/page/Main'], resolve);
const TestLogin = resolve => require(['@/components/views/TestLogin'], resolve);
const InitRouter = resolve => require(['@/components/views/InitRouter'], resolve);

/*商品*/
const classify = resolve => require(['@/components/views/commodity/Classify'], resolve);
const brand = resolve => require(['@/components/views/commodity/Brand'], resolve);
const customAttribute = resolve => require(['@/components/views/commodity/CustomAttribute'], resolve);

const GoodsList = resolve => require(['@/components/views/commodity/GoodsList.vue'], resolve);
const suit = resolve => require(['@/components/views/commodity/Suit'], resolve);
  const goodsEdit = resolve => require(['@/components/views/commodity/children/GoodsListEdit'], resolve);
  const suitEdit = resolve => require(['@/components/views/commodity/children/SuitEdit'], resolve);
const InternetGoods = resolve => require(['@/components/views/commodity/InternetGoods.vue'], resolve);
const GoodsDownCenter = resolve => require(['@/components/views/commodity/GoodsDownCenter.vue'], resolve);
const ChangeGoods = resolve => require(['@/components/views/commodity/children/ChangeGoods.vue'], resolve);
const KeepLog = resolve => require(['@/components/views/commodity/children/KeepLog.vue'], resolve);

/*设置*/
const shop = resolve => require(['@/components/views/setUp/Shop'], resolve);
const express = resolve => require(['@/components/views/setUp/Express'], resolve);
const supplier = resolve => require(['@/components/views/setUp/supplier'], resolve);
const operationLog = resolve => require(['@/components/views/setUp/OperationLog'], resolve);

/*增值*/
const industrialization = resolve => require(['@/components/views/appreciation/Industrialization'], resolve);

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
        // 商品
        {
          path:'/classify',
          component:classify
        },
        {
          path:'/brand',
          component:brand
        },
        {
          path:'/customAttribute',
          component:customAttribute
        },
        {
          path:'/goodsList',
          component:GoodsList
        },
        {
          path:'/goodsEdit/:skuId/:type',
          name:'goodsEdit',
          component:goodsEdit
        },
        {
          path:'/suit',
          component:suit
        },
        {
          path:'/suitEdit/:skuId/:type',
          name:'suitEdit',
          component:suitEdit
        },
        {
          path:'/internetGoods',
          component:InternetGoods
        },
        {
          path:'/goodsDownCenter',
          component:GoodsDownCenter
        },
        {
          path:'/changeGoods',
          component:ChangeGoods
        },
        {
          path:'/keepLog',
          component:KeepLog
        },
        // 设置
        {
          path:'/shop',
          component:shop
        },
        {
          path:'/express',
          component:express
        },
        {
          path:'/supplier',
          component:supplier
        },
        {
          path:'/operationLog',
          component:operationLog
        },
        // 增值
        {
          path:'/industrialization',
          component:industrialization
        },
      ]
    }
  ]
})
