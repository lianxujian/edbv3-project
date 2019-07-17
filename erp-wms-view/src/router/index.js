import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/page/Main'

//商品模块（chunk_0）
// import AsStock from '@/components/views/commodity/AsStock.vue'
const AsStock = r => require.ensure([], () => r(require('@/components/views/commodity/AsStock.vue')), 'chunk_0');
// import WaveSetup from '@/components/views/commodity/children/WaveSetup.vue'
const WaveSetup = r => require.ensure([], () => r(require('@/components/views/commodity/children/WaveSetup.vue')), 'chunk_0');
// import AddStrategy from '@/components/views/commodity/children/children/AddStrategy.vue'
const AddStrategy = r => require.ensure([], () => r(require('@/components/views/commodity/children/children/AddStrategy.vue')), 'chunk_0');
// import StrategyDetail from '@/components/views/commodity/children/children/StrategyDetail.vue'
const StrategyDetail = r => require.ensure([], () => r(require('@/components/views/commodity/children/children/StrategyDetail.vue')), 'chunk_0');
// import EditStrategy from '@/components/views/commodity/children/children/EditStrategy.vue'
const EditStrategy = r => require.ensure([], () => r(require('@/components/views/commodity/children/children/EditStrategy.vue')), 'chunk_0');
// import GoodsEditStrategy from '@/components/views/commodity/children/GoodsEditStrategy.vue'
const GoodsEditStrategy = r => require.ensure([], () => r(require('@/components/views/commodity/children/GoodsEditStrategy.vue')), 'chunk_0');
// import BatchQuery from '@/components/views/commodity/BatchQuery.vue'
const BatchQuery = r => require.ensure([], () => r(require('@/components/views/commodity/BatchQuery.vue')), 'chunk_0');
// import BatchSetup from '@/components/views/commodity/BatchSetup.vue'
const BatchSetup = r => require.ensure([], () => r(require('@/components/views/commodity/BatchSetup.vue')), 'chunk_0');
// import BatchDetail from '@/components/views/commodity/children/BatchDetail.vue'
const BatchDetail = r => require.ensure([], () => r(require('@/components/views/commodity/children/BatchDetail.vue')), 'chunk_0');

//发货模块（chunk_1）
// import CreateWave from '@/components/views/sendGoods/CreateWave.vue'
const CreateWave = r => require.ensure([], () => r(require('@/components/views/sendGoods/CreateWave.vue')), 'chunk_1');
// import WaveList from '@/components/views/sendGoods/WaveList.vue'
const WaveList = r => require.ensure([], () => r(require('@/components/views/sendGoods/WaveList.vue')), 'chunk_1');
// import StockDiffBill from '@/components/views/sendGoods/StockDiffBill.vue'
const StockDiffBill = r => require.ensure([], () => r(require('@/components/views/sendGoods/StockDiffBill.vue')), 'chunk_1');
// import AgainSorting from '@/components/views/sendGoods/AgainSorting.vue'
const AgainSorting = r => require.ensure([], () => r(require('@/components/views/sendGoods/AgainSorting.vue')), 'chunk_1');
// import CheckPackage from '@/components/views/sendGoods/CheckPackage.vue'
const CheckPackage = r => require.ensure([], () => r(require('@/components/views/sendGoods/CheckPackage.vue')), 'chunk_1');
// import CheckGoods from '@/components/views/sendGoods/CheckGoods.vue'
const CheckGoods = r => require.ensure([], () => r(require('@/components/views/sendGoods/CheckGoods.vue')), 'chunk_1');
// import Weigh from '@/components/views/sendGoods/Weigh.vue'
const Weigh = r => require.ensure([], () => r(require('@/components/views/sendGoods/Weigh.vue')), 'chunk_1');
// import BatchWeigh from '@/components/views/sendGoods/BatchWeigh.vue'
const BatchWeigh = r => require.ensure([], () => r(require('@/components/views/sendGoods/BatchWeigh.vue')), 'chunk_1');
// import Shipments from '@/components/views/sendGoods/Shipments.vue'
const Shipments = r => require.ensure([], () => r(require('@/components/views/sendGoods/Shipments.vue')), 'chunk_1');
// import SendFailure from '@/components/views/sendGoods/SendFailure.vue'
const SendFailure = r => require.ensure([], () => r(require('@/components/views/sendGoods/SendFailure.vue')), 'chunk_1');
// import Supplement from '@/components/views/sendGoods/Supplement.vue'
const Supplement = r => require.ensure([], () => r(require('@/components/views/sendGoods/Supplement.vue')), 'chunk_1');

//仓储模块（chunk_2）
// import Stock from '@/components/views/stock/Stock'
const Stock = r => require.ensure([], () => r(require('@/components/views/stock/Stock')), 'chunk_2');
// import StorageStock from '@/components/views/stock/StorageStock'
const StorageStock = r => require.ensure([], () => r(require('@/components/views/stock/StorageStock')), 'chunk_2');
// import Seat from '@/components/views/stock/Seat'
const Seat = r => require.ensure([], () => r(require('@/components/views/stock/Seat')), 'chunk_2');
// import Snapshot from '@/components/views/stock/Snapshot'
const Snapshot = r => require.ensure([], () => r(require('@/components/views/stock/Snapshot')), 'chunk_2');
// import Log from '@/components/views/stock/Log'
const Log = r => require.ensure([], () => r(require('@/components/views/stock/Log')), 'chunk_2');
// import Adjust from '@/components/views/stock/Adjust'
const Adjust = r => require.ensure([], () => r(require('@/components/views/stock/Adjust')), 'chunk_2');
// import Wave from '@/components/views/stock/Wave'
const Wave = r => require.ensure([], () => r(require('@/components/views/stock/Wave')), 'chunk_2');
// import UpShelves from '@/components/views/stock/UpShelves.vue'
const UpShelves = r => require.ensure([], () => r(require('@/components/views/stock/UpShelves.vue')), 'chunk_2');
// import DownShelves from '@/components/views/stock/DownShelves'
const DownShelves = r => require.ensure([], () => r(require('@/components/views/stock/DownShelves')), 'chunk_2');
// import Deliver from '@/components/views/stock/Deliver'
const Deliver = r => require.ensure([], () => r(require('@/components/views/stock/Deliver')), 'chunk_2');
// import OutStock from '@/components/views/stock/OutStock'
const OutStock = r => require.ensure([], () => r(require('@/components/views/stock/OutStock')), 'chunk_2');
// import InStock from '@/components/views/stock/InStock'
const InStock = r => require.ensure([], () => r(require('@/components/views/stock/InStock')), 'chunk_2');
// import ExamineGoods from '@/components/views/stock/ExamineGoods'//秋香-验货出库
const ExamineGoods = r => require.ensure([], () => r(require('@/components/views/stock/ExamineGoods')), 'chunk_2');
// import EnterShelves from '@/components/views/stock/EnterShelves'
const EnterShelves = r => require.ensure([], () => r(require('@/components/views/stock/EnterShelves')), 'chunk_2');
// import OrderDetail from '@/components/views/stock/children/OrderDetail'
const OrderDetail = r => require.ensure([], () => r(require('@/components/views/stock/children/OrderDetail')), 'chunk_2');
// import Change from '@/components/views/stock/Change'
const Change = r => require.ensure([], () => r(require('@/components/views/stock/Change')), 'chunk_2');
// import Replenishment from '@/components/views/stock/Replenishment'
const Replenishment = r => require.ensure([], () => r(require('@/components/views/stock/Replenishment')), 'chunk_2');
// import Inventory from '@/components/views/stock/Inventory'
const Inventory = r => require.ensure([], () => r(require('@/components/views/stock/Inventory')), 'chunk_2');
// import Bill from '@/components/views/stock/children/Bill.vue'
const Bill = r => require.ensure([], () => r(require('@/components/views/stock/children/Bill.vue')), 'chunk_2');
// import Modify from '@/components/views/stock/children/Modify.vue'
const Modify = r => require.ensure([], () => r(require('@/components/views/stock/children/Modify.vue')), 'chunk_2');
// import Examine from '@/components/views/stock/children/Examine.vue'
const Examine = r => require.ensure([], () => r(require('@/components/views/stock/children/Examine.vue')), 'chunk_2');
// import CheckAdjust from '@/components/views/stock/children/CheckAdjust.vue'
const CheckAdjust = r => require.ensure([], () => r(require('@/components/views/stock/children/CheckAdjust.vue')), 'chunk_2');
// import AddAdjust from '@/components/views/stock/children/AddAdjust.vue'
const AddAdjust = r => require.ensure([], () => r(require('@/components/views/stock/children/AddAdjust.vue')), 'chunk_2');
// import ChangeWave from '@/components/views/stock/children/ChangeWave.vue'
const ChangeWave = r => require.ensure([], () => r(require('@/components/views/stock/children/ChangeWave.vue')), 'chunk_2');
// import WaveStrategyDetail from '@/components/views/stock/children/WaveStrategyDetail.vue'
const WaveStrategyDetail = r => require.ensure([], () => r(require('@/components/views/stock/children/WaveStrategyDetail.vue')), 'chunk_2');
// import AddWave from '@/components/views/stock/children/AddWave.vue'
const AddWave = r => require.ensure([], () => r(require('@/components/views/stock/children/AddWave.vue')), 'chunk_2');
// import AddOutbound from '@/components/views/stock/children/AddOutbound.vue'// 出库添加出库单-秋香
const AddOutbound = r => require.ensure([], () => r(require('@/components/views/stock/children/AddOutbound.vue')), 'chunk_2');
// import ConfirmPick from '@/components/views/stock/children/ConfirmPick.vue'// 拣货详情-秋香
const ConfirmPick = r => require.ensure([], () => r(require('@/components/views/stock/children/ConfirmPick.vue')), 'chunk_2');
// import OutboundDetail from '@/components/views/stock/children/OutboundDetail.vue'// 出库单详情-秋香
const OutboundDetail = r => require.ensure([], () => r(require('@/components/views/stock/children/OutboundDetail.vue')), 'chunk_2');
// import InventoryDetails from '@/components/views/stock/children/InventoryDetails.vue'// 入库单详情-秋香
const InventoryDetails = r => require.ensure([], () => r(require('@/components/views/stock/children/InventoryDetails.vue')), 'chunk_2');
// import ListDetails from '@/components/views/stock/children/ListDetails.vue'// 上架入库单详情-秋香
const ListDetails = r => require.ensure([], () => r(require('@/components/views/stock/children/ListDetails.vue')), 'chunk_2');
// import AmendOutbound from '@/components/views/stock/children/AmendOutbound.vue'// 出库修改出库单-秋香
const AmendOutbound = r => require.ensure([], () => r(require('@/components/views/stock/children/AmendOutbound.vue')), 'chunk_2');
// import OutbReview from '@/components/views/stock/children/OutbReview.vue'//  审核出库单-佩玖
const OutbReview = r => require.ensure([], () => r(require('@/components/views/stock/children/OutbReview.vue')), 'chunk_2');
// import Outrevision from '@/components/views/stock/children/Outrevision.vue'//  修改出库单-佩玖
const Outrevision = r => require.ensure([], () => r(require('@/components/views/stock/children/Outrevision.vue')), 'chunk_2');
// import Amendinstorage from '@/components/views/stock/children/Amendinstorage.vue'//  修改入库单-佩玖
const Amendinstorage = r => require.ensure([], () => r(require('@/components/views/stock/children/Amendinstorage.vue')), 'chunk_2');
// import CauExceSin from '@/components/views/stock/CauExceSin.vue'// 损益单-佩玖
const CauExceSin = r => require.ensure([], () => r(require('@/components/views/stock/CauExceSin.vue')), 'chunk_2');
// import CheckCauExceSin from '@/components/views/stock/children/CheckCauExceSin.vue'// 查看损益单-佩玖
const CheckCauExceSin = r => require.ensure([], () => r(require('@/components/views/stock/children/CheckCauExceSin.vue')), 'chunk_2');
// import AuditCauExceSin from '@/components/views/stock/children/AuditCauExceSin.vue'// 审核损益单-佩玖
const AuditCauExceSin = r => require.ensure([], () => r(require('@/components/views/stock/children/AuditCauExceSin.vue')), 'chunk_2');
// import Addinstorage from '@/components/views/stock/children/Addinstorage.vue'// 新增入库单-佩玖
const Addinstorage = r => require.ensure([], () => r(require('@/components/views/stock/children/Addinstorage.vue')), 'chunk_2');

//会员模块（chunk_0）
// import MemberList from '@/components/views/memBer/MemberList.vue'   //会员-佩玖
const MemberList = r => require.ensure([], () => r(require('@/components/views/memBer/MemberList.vue')), 'chunk_0');
// import Memberdetaimport from '@/components/views/memBer/children/Memberdetaimport.vue'// 会员导入
const Memberdetaimport = r => require.ensure([], () => r(require('@/components/views/memBer/children/Memberdetaimport.vue')), 'chunk_0');

//设置模块（chunk_3）
// import AsStockSetup from '@/components/views/setUp/AsStockSetup.vue'
const AsStockSetup = r => require.ensure([], () => r(require('@/components/views/setUp/AsStockSetup.vue')), 'chunk_3');
// import Warehouse from '@/components/views/setUp/Warehouse.vue' // 仓库
const Warehouse = r => require.ensure([], () => r(require('@/components/views/setUp/Warehouse.vue')), 'chunk_3');
// import addWarehouse from '@/components/views/setUp/children/AddWarehouse.vue'// 添加仓库
const addWarehouse = r => require.ensure([], () => r(require('@/components/views/setUp/children/AddWarehouse.vue')), 'chunk_3');
// import amendWarehouse from '@/components/views/setUp/children/AmendWarehouse.vue'// 修改仓库
const amendWarehouse = r => require.ensure([], () => r(require('@/components/views/setUp/children/AmendWarehouse.vue')), 'chunk_3');
// import bindExpress from '@/components/views/setUp/children/BindExpress.vue'// 绑定快递
const bindExpress = r => require.ensure([], () => r(require('@/components/views/setUp/children/BindExpress.vue')), 'chunk_3');
// import lookFreight from '@/components/views/setUp/children/LookFreight.vue'// 编辑快递运费模板
const lookFreight = r => require.ensure([], () => r(require('@/components/views/setUp/children/LookFreight.vue')), 'chunk_3');
// import StorageLocation from '@/components/views/setUp/StorageLocation.vue'
const StorageLocation = r => require.ensure([], () => r(require('@/components/views/setUp/StorageLocation.vue')), 'chunk_3');
// import StorageFarm from '@/components/views/setUp/StorageFarm.vue'
const StorageFarm = r => require.ensure([], () => r(require('@/components/views/setUp/StorageFarm.vue')), 'chunk_3');
// import AutoWarehouse from '@/components/views/setUp/AutoWarehouse.vue' // 智能仓库
const AutoWarehouse = r => require.ensure([], () => r(require('@/components/views/setUp/AutoWarehouse.vue')), 'chunk_3');
// import storeSetup   from '@/components/views/setUp/children/StoreSetup.vue' // 属地仓设置
const storeSetup = r => require.ensure([], () => r(require('@/components/views/setUp/children/StoreSetup.vue')), 'chunk_3');
// import addAddress  from '@/components/views/setUp/children/AddAddress.vue' // 属地仓添加
const addAddress = r => require.ensure([], () => r(require('@/components/views/setUp/children/AddAddress.vue')), 'chunk_3');
// import amendAddress from '@/components/views/setUp/children/AmendAddress.vue' // 属地仓修改
const amendAddress = r => require.ensure([], () => r(require('@/components/views/setUp/children/AmendAddress.vue')), 'chunk_3');
// import productSetup from '@/components/views/setUp/children/ProductSetup.vue' // 产品指定仓设置
const productSetup = r => require.ensure([], () => r(require('@/components/views/setUp/children/ProductSetup.vue')), 'chunk_3');
// import setupStore from '@/components/views/setUp/children/SetupStore.vue' // 产品-设置仓库
const setupStore = r => require.ensure([], () => r(require('@/components/views/setUp/children/SetupStore.vue')), 'chunk_3');
// import SingleNumber from '@/components/views/stock/children/SingleNumber.vue'  //上架单详情- 秋香
const SingleNumber = r => require.ensure([], () => r(require('@/components/views/stock/children/SingleNumber.vue')), 'chunk_3');
// import NewStrategy from '@/components/views/stock/children/NewStrategy.vue'  //新增上架策略- 秋香
const NewStrategy = r => require.ensure([], () => r(require('@/components/views/stock/children/NewStrategy.vue')), 'chunk_3');
// import NextStrategy from '@/components/views/stock/children/NextStrategy.vue'  //新增下架策略-秋香
const NextStrategy = r => require.ensure([], () => r(require('@/components/views/stock/children/NextStrategy.vue')), 'chunk_3');
// import WarehousingConfirm from '@/components/views/stock/children/WarehousingConfirm.vue'  //入库确认-秋香
const WarehousingConfirm = r => require.ensure([], () => r(require('@/components/views/stock/children/WarehousingConfirm.vue')), 'chunk_3');
// import UpdateNextStrategy from '@/components/views/stock/children/UpdateNextStrategy.vue'  //新增下架策略-秋香
const UpdateNextStrategy = r => require.ensure([], () => r(require('@/components/views/stock/children/UpdateNextStrategy.vue')), 'chunk_3');
// import UpdateNewStrategy from '@/components/views/stock/children/UpdateNewStrategy.vue'  //新增下架策略-秋香
const UpdateNewStrategy = r => require.ensure([], () => r(require('@/components/views/stock/children/UpdateNewStrategy.vue')), 'chunk_3');
// import AddChange from '@/components/views/stock/children/AddChange.vue' //添加移位单-秋香
const AddChange = r => require.ensure([], () => r(require('@/components/views/stock/children/AddChange.vue')), 'chunk_3');
// import UpdateChange from '@/components/views/stock/children/UpdateChange.vue' //添加移位单-秋香
const UpdateChange = r => require.ensure([], () => r(require('@/components/views/stock/children/UpdateChange.vue')), 'chunk_3');
// import NoChange from '@/components/views/stock/children/NoChange.vue' //移位单详情-秋香
const NoChange = r => require.ensure([], () => r(require('@/components/views/stock/children/NoChange.vue')), 'chunk_3');
// import SureChange from '@/components/views/stock/children/SureChange.vue' //移位单详情-秋香
const SureChange = r => require.ensure([], () => r(require('@/components/views/stock/children/SureChange.vue')), 'chunk_3');
// import WaveDetail from '@/components/views/sendGoods/children/WaveDetail.vue'  //波次明细- 秋香
const WaveDetail = r => require.ensure([], () => r(require('@/components/views/sendGoods/children/WaveDetail.vue')), 'chunk_3');
// import autoExpress from '@/components/views/setUp/AutoExpress.vue' //智能快递-秋香
const autoExpress = r => require.ensure([], () => r(require('@/components/views/setUp/AutoExpress.vue')), 'chunk_3');
// import warehouseProcesse from '@/components/views/setUp/warehouseProcesse.vue' //智能快递-秋香
const warehouseProcesse = r => require.ensure([], () => r(require('@/components/views/setUp/warehouseProcesse.vue')), 'chunk_3');
// import WarehouseParam from '@/components/views/setUp/WarehouseParam.vue'
const WarehouseParam = r => require.ensure([], () => r(require('@/components/views/setUp/WarehouseParam.vue')), 'chunk_3');
// import DiffReason from '@/components/views/setUp/DiffReason.vue'
const DiffReason = r => require.ensure([], () => r(require('@/components/views/setUp/DiffReason.vue')), 'chunk_3');
// import ExpressTemplate from '@/components/views/setUp/ExpressTemplate.vue' // 快递单模板
const ExpressTemplate = r => require.ensure([], () => r(require('@/components/views/setUp/ExpressTemplate.vue')), 'chunk_3');
// import ServiceTemplate from '@/components/views/setUp/ServiceTemplate.vue' // 业务单模板
const ServiceTemplate = r => require.ensure([], () => r(require('@/components/views/setUp/ServiceTemplate.vue')), 'chunk_3');
// import SpecifiedDelivery from '@/components/views/setUp/children/SpecifiedDelivery.vue' //指定快递配置
const SpecifiedDelivery = r => require.ensure([], () => r(require('@/components/views/setUp/children/SpecifiedDelivery.vue')), 'chunk_3');

//增值模块（chunk_0）
// import Industrialization from '@/components/views/increment/Industrialization.vue'
const Industrialization = r => require.ensure([], () => r(require('@/components/views/increment/Industrialization.vue')), 'chunk_0');

//其他模块（chunk_0）
// import TestLogin from '@/components/views/TestLogin.vue'
const TestLogin = r => require.ensure([], () => r(require('@/components/views/TestLogin.vue')), 'chunk_0');
// import InitRouter from '@/components/views/InitRouter.vue'
const InitRouter = r => require.ensure([], () => r(require('@/components/views/InitRouter.vue')), 'chunk_0');
// import Test from '@/components/common/Drag.vue'//测试页面
const Test = r => require.ensure([], () => r(require('@/components/common/Drag.vue')), 'chunk_0');

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
        //商品
        {
          path: '/asStock',
          component: AsStock
        },
        {
          path: '/waveSetup',
          component: WaveSetup
        },
        {
          path: '/addStrategy',
          component: AddStrategy
        },
        {
          path: '/strategyDetail/:id',
          component: StrategyDetail
        },
        {
          path: '/editStrategy/:id',
          component: EditStrategy
        },
        {
          path: '/goodsEditStrategy/:id',
          component: GoodsEditStrategy
        },
        {
          path:'/batchQuery',
          component:BatchQuery
        },
        {
          path:'/batchSetup',
          component:BatchSetup
        },
        {
          path:'/batchDetail/:id',
          component:BatchDetail
        },
        //发货
        {
          path: '/createWave',
          component: CreateWave
        },
        {
          path: '/waveList',
          component: WaveList,
          meta:{keepAlive: true}

        },
        {
          path: '/stockDiffBill',
          component: StockDiffBill
        },
        {
          path: '/againSorting',
          component: AgainSorting
        },
        {
          path: '/checkPackage',
          component: CheckPackage
        },
        {
          path: '/checkGoods',
          component: CheckGoods
        },
        {
          path: '/weigh',
          component: Weigh
        },
        {
          path: '/batchWeigh',
          component: BatchWeigh
        },
        {
          path: '/shipments',
          component: Shipments
        },
        {
          path: '/sendFailure',
          component: SendFailure
        },
        {
          path:'/supplement',
          component: Supplement
        },
        {
          path:'/WaveDetail/:stockWaveId/:waveOrderNo/:waveType', //波次明细 秋香
          component: WaveDetail,
          name: 'WaveDetail'
        },

        //仓储
        {
          path: '/',
          redirect: '/initRouter'
        },
        {
          path:'/initRouter',
          component: InitRouter
        },
        {
          path:'/testLogin',
          component:TestLogin
        },
        {
          path:'/stock',
          component:Stock
        },
        {
          path:'/storageStock',
          component:StorageStock
        },
        {
          path:'/seat',
          component:Seat
        },
        {
          path:'/snapshot',
          component:Snapshot
        },
        {
          path:'/log',
          component:Log
        },
        {
          path:'/adjust',
          component:Adjust
        },
        {
          path:'/wave',
          component:Wave
        },
        {
          path:'/upShelves',
          component:UpShelves
        },
        {
          path:'/downShelves',
          component:DownShelves
        },
        {
          path:'/deliver',
          component:Deliver
        },
        {
          path:'/outStock',
          component:OutStock,
          meta:{keepAlive:true}
        },
        {
          path:'/inStock',
          component:InStock,
          meta:{keepAlive:true}
        },
        {
          path:'/ExamineGoods',
          component:ExamineGoods//秋香-验货出库
        },
        {
          path:'/enterShelves',
          component:EnterShelves,
          meta:{keepAlive:true}
        },
        {
          path:'/orderDetail/:orderId',
          name:'orderDetail',
          component:OrderDetail
        },
        {
          path:'/change',
          component:Change,
          meta:{keepAlive:true}
        },
        {
          path:'/replenishment',
          component:Replenishment
        },
        {
          path:'/inventory',
          component:Inventory
        },
        {
          path:'/bill/:num/:id',
          component:Bill
        },
        {
          path:'/modify/:id',
          component:Modify
        },
        {
          path:'/examine/:id',
          component:Examine
        },
        {
          path:'/checkAdjust/:id',
          component:CheckAdjust
        },
        {
          path:'/addAdjust',
          component:AddAdjust
        },
        {
          path:'/addWave',
          component:AddWave
        },
        {
          path:'/SingleNumber/:stockPutawayId/:storageId/:putawayStatus/:putawayType/:sourceOrderId',//上架单详情-秋香
          component:SingleNumber,
          name: 'SingleNumber',

        },
        {
          path:'/NewStrategy',//新增上架策略-秋香
          component:NewStrategy
        },
        {
          path:'/NextStrategy',//新增下架策略-秋香
          component:NextStrategy
        },
        {
          path:'/AddChange',//添加移位单-秋香
          component:AddChange
        },
        {
          path:'/UpdateChange/:id',//修改移位单-秋香
          component:UpdateChange
        },
        {
          path:'/NoChange/:id',//移位单详情-秋香
          component:NoChange,
        },
        {
          path:'/SureChange/:id',//确认移位-秋香
          component:SureChange
        },
        {
          path:'/outbReview/:Id',//审核出库单-佩玖
          component:OutbReview
        },
        {
          path:'/outrevision/:Id',//修改出库单-佩玖
          component:Outrevision
        },
        {
          path:'/amendinstorage/:Id',//修改入库单-佩玖
          component:Amendinstorage
        },

        {
          path:'/UpdateNextStrategy/:soldoutStrategyId',//编辑下架策略-秋香
          component:UpdateNextStrategy,
          name: 'UpdateNextStrategy'
        },
        {
          path:'/UpdateNewStrategy/:putawayStrategyId',//编辑上架策略-秋香
          component:UpdateNewStrategy,
          name: 'UpdateNewStrategy'
        },
        {
          path:'/InventoryDetails/:stockInNo',//入库详情秋香
          component:InventoryDetails,
          name:'InventoryDetails'
        },{
          path:'/ListDetails/:stockInNo',//上架入库详情秋香
          component:ListDetails,
          name:'ListDetails'
        },{
          path:'/WarehousingConfirm/:stockInNo',//入库确认秋香
          component:WarehousingConfirm,
          name:'WarehousingConfirm'
        },
        {
          path:'/addOutbound',//出库添加出库单-秋香
          component:AddOutbound
        },
        {
          path:'/Addinstorage',//入库添新增-佩玖
          component:Addinstorage
        },
        {
          path:'/outboundDetail',//待审核单详情秋香
          component:OutboundDetail,
          name:'OutboundDetail'
        },{
          path:'/ConfirmPick/:stockOutNo/:stockOutId',//拣货详情-秋香
          component:ConfirmPick,
          name:'ConfirmPick'
        },
        {
          path:'/amendOutbound',//出库修改出库单-秋香
          component:AmendOutbound
        },
        {
          path:'/changeWave/:id',
          component:ChangeWave
        },
        {
          path:'/waveStrategyDetail/:id',
          component:WaveStrategyDetail
        },
        {
          path:'/cauExceSin',  //损益单  佩玖
          component:CauExceSin,
          meta:{keepAlive: true}
        },
        {
          path:'/checkCauExceSin', //查看损益单  佩玖
          component:CheckCauExceSin,
          name:'CheckCauExceSin'
        },
        {
          path:'/auditCauExceSin',  //审核损益单  佩玖
          component:AuditCauExceSin,
          name:'AuditCauExceSin'
        },
        {
          path:'/memberList',    //会员列表  佩玖
          component:MemberList,
          meta:{keepAlive: true}

        },


        // 会员导入
        {
          path:'/memberdetaimport/:id',    //会员导入  佩玖
          component:Memberdetaimport,

        },

        //设置
        {
          path:'/warehouse', //仓库
          component:Warehouse,
          name:'warehouse'
        },
        {
          path:'/addWarehouse', //添加仓库（子）
          component:addWarehouse
        },
        {
          path:'/amendWarehouse/:storeId', //修改仓库（子）
          component:amendWarehouse,
          name: 'amendWarehouse'
        },
        {
          path:'/bindExpress/:storageId', //绑定快递（子）
          component:bindExpress,
          name: 'bindExpress'
        },
        {
          path:'/lookFreight/:storageId/:expressId', //编辑快递运费模板（子）
          component:lookFreight,
          name: 'lookFreight'
        },
        {
          path:'/storageLocation',
          component:StorageLocation
        },
        {
          path:'/storageFarm',
          component:StorageFarm
        },
        {
          path:'/autoWarehouse',  // 智能仓库
          component:AutoWarehouse,
          name: 'autoWarehouse'
        },
        {
          path:'/autoExpress',  // 智能快递
          component:autoExpress,
          name: 'autoExpress'
        },
        {
          path:'/warehouseProcesse',  // 仓库流程-秋香
          component:warehouseProcesse,
          name: 'warehouseProcesse'
        },{
          path:'/warehouseParam',
          component:WarehouseParam
        },{
          path:'/diffReason',
          component:DiffReason
        },
        {
          path:'/expressTemplate', // 快递单模块
          component:ExpressTemplate,
          name: 'expressTemplate'
        },
        {
          path:'/serviceTemplate', // 业务单模块
          component:ServiceTemplate,
          name: 'serviceTemplate'
        },
        {
          path:'/SpecifiedDelivery',  // 指定快递配置
          component:SpecifiedDelivery,
          name: 'SpecifiedDelivery'
        },
        {
          path:'/storeSetup/:state/:intellectStorageId',  // 属地仓设置（子）
          component:storeSetup,
          name: 'storeSetup'
        },
        {
          path:'/addAddress/:id/:intellectStorageId',  // 属地仓添加（子）
          component:addAddress,
          name: 'addAddress'
        },
        {
          path:'/amendAddress/:id/:reId/:regionId/:intellectStorageId',  // 属地仓修改（子）
          component:amendAddress,
          name: 'amendAddress'
        },
        {
          path:'/productSetup/:state',  // 产品指定仓设置（子）
          component:productSetup,
          name: 'productSetup'
        },
        {
          path:'/setupStore/:id',  // 产品指定仓设置（子）
          component:setupStore,
          name: 'setupStore'
        },
        {
          path: '/asStockSetup',
          component: AsStockSetup
        },
        //增值
        {
          path: '/industrialization',
          component: Industrialization
        },
        //测试用路由
        {
          path:'/test',
          component:Test
        }
      ]
    }
  ]
})
