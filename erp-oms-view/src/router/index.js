import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/page/Main'
import TestLogin from '@/components/views/TestLogin.vue'
import InitRouter from '@/components/views/InitRouter.vue'
/*订单管理*/
const OrderProcessing = resolve => require(['@/components/views/order/OrderProcessing'], resolve);
const OrderDetail = resolve => require(['@/components/views/order/children/OrderDetail'], resolve);
const OrderQuery = resolve => require(['@/components/views/order/OrderQuery'], resolve);
const OriginalOrder = resolve => require(['@/components/views/order/OriginalOrder'], resolve);
const originalDetail = resolve => require(['@/components/views/order/children/Original_Detail'], resolve);
const InvoicesControl = resolve => require(['@/components/views/order/InvoicesControl'], resolve);
const InvoicesControlSetting = resolve => require(['@/components/views/order/children/InvoicesControlSetting'], resolve);
const InvoicesControlBilling = resolve => require(['@/components/views/order/children/InvoicesControlBilling'], resolve);
const ExceptionOrder = resolve => require(['@/components/views/order/ExceptionOrder'], resolve);

/*商品管理*/
//赠品策略
const GiftStrategy = resolve => require(['@/components/views/commodity/GiftStrategy'], resolve);
const GiftAdd = resolve => require(['@/components/views/commodity/children/GiftAdd'], resolve);

const GiftList = resolve => require(['@/components/views/commodity/GiftList'], resolve);

const GiftAdjust = resolve => require(['@/components/views/commodity/GiftAdjust'], resolve);
const adjustEdit = resolve => require(['@/components/views/commodity/children/AdjustEdit'], resolve);

const suitAdjust = resolve => require(['@/components/views/commodity/SuitAdjust'], resolve);
const suitEdit = resolve => require(['@/components/views/commodity/children/SuitEdit'], resolve);

const taskCenter = resolve => require(['@/components/views/commodity/TaskCenter'], resolve);
  const updateTask = resolve => require(['@/components/views/commodity/children/UpdateTask'], resolve);
  const deleteTask = resolve => require(['@/components/views/commodity/children/DeleteTask'], resolve);
const salesCenter = resolve => require(['@/components/views/commodity/SalesCenter'], resolve);

/*售后*/
const AfterSaleDispose = resolve => require(['@/components/views/afterSale/AfterSaleDispose'], resolve);
const AfterSaleQuery = resolve => require(['@/components/views/afterSale/AfterSaleQuery'], resolve);
const QuickSalesReturn = resolve => require(['@/components/views/afterSale/QuickSalesReturn'], resolve);
const AftetSlateDetails = resolve => require(['@/components/views/afterSale/children/AftetSlateDetails'], resolve);

/*设置*/
const AutomaticReviewScheme = resolve => require(['@/components/views/setUp/AutomaticReviewScheme'], resolve);
const AutomaticReviewSchemeSetting = resolve => require(['@/components/views/setUp/children/AutomaticReviewSchemeSetting'], resolve);
const OrderMarks = resolve => require(['@/components/views/setUp/OrderMarks'], resolve);
const OrderMarkWeight = resolve => require(['@/components/views/setUp/children/OrderMarkWeight'], resolve);
const OrderMarkOvertime = resolve => require(['@/components/views/setUp/children/OrderMarkOvertime'], resolve);
const OrderMarkSetting = resolve => require(['@/components/views/setUp/children/OrderMarkSetting'], resolve);
const OrderSet = resolve => require(['@/components/views/setUp/OrderSet'], resolve);
const AfterSaleSet = resolve => require(['@/components/views/setUp/AfterSaleSet'], resolve);
import AfterCustom from '@/components/views/setUp/AfterCustom.vue'

/*demo*/
const FormTest = resolve => require(['@/components/views/zdemo/FormTest'], resolve);
const AgGridVue = resolve => require(['@/components/views/zdemo/AgGridVue'], resolve);

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
        {
          path:'/AgGridVue',
          component:AgGridVue
        },
        //订单管理
        {
          path:'/orderProcessing',
          component:OrderProcessing,
          name:'orderProcess'
        },
        {
          path:'/orderDetail/:orderId/:fromPage',
          name:'orderDetail',
          component:OrderDetail
        },
        {
          path:'/orderQuery',
          name:'orderQuery',
          component:OrderQuery
        },
        {
          path:'/originalOrder',
          name:'originalOrder',
          component:OriginalOrder,
          meta:{
            keepAlive:true
          }
        },
        {
          path:'/originalDetail',
          component:originalDetail
        },
        {
          path:'/invoicesControl',
          name:'invoicesControl',
          component:InvoicesControl
        },
        {
          path:'/invoicesControlSetting',
          name:'invoicesControlSetting',
          component:InvoicesControlSetting
        },
        {
          path:'/invoicesControlBilling',
          name:'invoicesControlBilling',
          component:InvoicesControlBilling
        },
        {
          path:'/exceptionOrder',
          component:ExceptionOrder
        },
        //商品管理
        {
          path:'/giftStrategy',
          component:GiftStrategy
        },
        {
          path:'/giftAdd',
          component:GiftAdd
        },
        {
          path:'/giftList',
          component:GiftList
        },
        {
          path:'/giftAdjust',
          component:GiftAdjust
        },
        {
          path:'/adjustEdit/:adjustId/:type',
          name:'adjustEdit',
          component:adjustEdit
        },
        {
          path:'/suitAdjust',
          component:suitAdjust
        },
        {
          path:'/suitEdit/:adjustId/:type',
          name:'suitEdit',
          component:suitEdit
        },
        {
          path:'/taskCenter',
          component:taskCenter,
          meta:{
            keepAlive:true
          }
        },
        {
          path:'/salesCenter',
          component:salesCenter,
        },
        {
          path:'/updateTask',
          component:updateTask
        },
        {
          path:'/deleteTask',
          component:deleteTask
        },
        //售后
        {
          path:'/afterSaleDispose',
          component:AfterSaleDispose
        },
        {
          path:'/afterSaleQuery',
          component:AfterSaleQuery
        },
        {
          path:'/quickSalesReturn',
          component:QuickSalesReturn
        },
        {
          path:'/AftetSlateDetails/:id',
          component:AftetSlateDetails
        },
        //设置
        {
          path:'/automaticReviewScheme',
          name:'automaticReviewScheme',
          component:AutomaticReviewScheme
        },
        {
          path:'/automaticReviewSchemeSetting/:planId/:type',
          name:'automaticReviewSchemeSetting',
          component:AutomaticReviewSchemeSetting
        },
        {
          path:'/orderMarks/:type',
          name:'orderMarks',
          component:OrderMarks
        },
        {
          path:'/orderMarkWeight/:signId/:type',
          name:'orderMarkWeight',
          component:OrderMarkWeight
        },
        {
          path:'/orderMarkOvertime/:signId/:type',
          name:'orderMarkOvertime',
          component:OrderMarkOvertime
        },
        {
          path:'/orderMarkSetting/:signId/:type',
          name:'orderMarkSetting',
          component:OrderMarkSetting
        },
        {
          path:'/orderSet',
          component:OrderSet
        },
        {
          path:'/afterSaleSet',
          component:AfterSaleSet
        },
        {
          path: '/afterCustom',
          component: AfterCustom
        },
        //demo
        {
          path: '/formTest',
          component: FormTest
        }
      ]
    }
  ]
})
