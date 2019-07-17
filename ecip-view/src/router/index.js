/**
 * Created by chenyin on 2019-05-30.
 */
import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/page/Main'
import Login from '@/components/views/Login.vue'
import Index from '@/components/views/Index.vue'
import Brand from '@/components/views/goodsCenter/Brand.vue'
import Classify from '@/components/views/goodsCenter/Classify.vue'
import AttribuLists from '@/components/views/goodsCenter/children/AttribuLists.vue'
import SingleGoods from '@/components/views/goodsCenter/SingleGoods.vue'
import SingleSku from '@/components/views/goodsCenter/SingleSku.vue'
import Suit from '@/components/views/goodsCenter/Suit.vue'
import SuitSku from '@/components/views/goodsCenter/SuitSku.vue'
import InternetGoods from '@/components/views/goodsCenter/InternetGoods.vue'
import GoodsBind from '@/components/views/goodsCenter/GoodsBind.vue'
import GoodSupervise from '@/components/views/goodsCenter/GoodSupervise.vue'
import ShopAdd from '@/components/views/goodsCenter/children/ShopAdd.vue'
import UpdateShop from '@/components/views/goodsCenter/children/UpdateShop.vue'
import HistoryList from '@/components/views/goodsCenter/children/HistoryList.vue'//历史记录

Vue.use(Router);

export default new Router({
  /*mode:'history',*/
  scrollBehavior: ()=>({y:0}),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/main',
      component: Main,
      children:[
        {
          path: '/',
          redirect: '/index'
        },
        {
          path:'/index',
          component:Index
        },
        {
          path: '/brand',
          component: Brand
        },
        {
          path: '/classify',
          component: Classify
        },
        {
          path: '/attribuLists',
          name:'AttribuLists',
          component: AttribuLists
        },
        {
          path:'/singleGoods',
          component:SingleGoods
        },
        {
          path:'/singleSku',
          component:SingleSku
        },
        {
          path:'/suit',
          component:Suit
        },
        {
          path:'/suitSku',
          component: SuitSku
        },
        {
          path:'/internetGoods',
          component: InternetGoods
        },
        {
          path:'/goodsBind',
          component: GoodsBind
        },
        {
          path:'/goodSupervise',
          component: GoodSupervise
        },
        {
          path:'/shopAdd',
          component: ShopAdd
        },
        {
          path:'/updateShop',
          component: UpdateShop
        },
        {
          path:'/historyList',
          component: HistoryList
        }
      ]
    }
  ]
})
