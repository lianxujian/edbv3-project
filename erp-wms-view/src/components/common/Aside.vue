<!--侧边导航 尘音-->
<template>
    <div id="aside">
      <div class="sidebar">

        <el-menu
          :default-active="onRoutes"
          router
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF">
          <!--商品-->
          <el-submenu index="commodityBox">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品</span>
            </template>
            <el-submenu index="asStockMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>同步库存</span>
              </template>
              <el-menu-item index="asStock" @click="asStock">同步库存</el-menu-item>
            </el-submenu>

            <el-submenu index="asStock">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>批次</span>
              </template>
              <el-menu-item index="batchQuery" @click="batchQuery">批次查询</el-menu-item>
              <el-menu-item index="batchSetup" @click="batchSetup">批次设置</el-menu-item>
            </el-submenu>

          </el-submenu>
          <!--发货-->
          <el-submenu index="sendGoods">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>发货</span>
            </template>
            <el-submenu index="waveMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>波次</span>
              </template>
              <el-menu-item index="createWave" @click="createWave">手工生成波次</el-menu-item>
              <el-menu-item index="waveList" @click="waveList">波次列表</el-menu-item>
            </el-submenu>

            <el-submenu index="iffBillMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>异常单</span>
              </template>
              <el-menu-item index="stockDiffBill" @click="stockDiffBill">仓库异常单</el-menu-item>
              <el-menu-item index="sendFailure" @click="sendFailure">发货失败列表</el-menu-item>
            </el-submenu>

            <el-submenu index="sortingMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>拣配</span>
              </template>
              <el-menu-item index="againSorting" @click="againSorting">二次分拣</el-menu-item>
              <el-menu-item index="checkPackage" @click="checkPackage">验货打包</el-menu-item>
              <el-menu-item index="checkGoods" @click="checkGoods">验货</el-menu-item>
              <el-menu-item index="weigh" @click="weigh">称重</el-menu-item>
              <el-menu-item index="batchWeigh" @click="batchWeigh">批量称重</el-menu-item>
              <el-menu-item index="shipments" @click="shipments">发货</el-menu-item>
              <el-menu-item index="supplement" @click="supplement">补打</el-menu-item>
            </el-submenu>
          </el-submenu>

          <!--仓储-->
          <el-submenu index="stockBox">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>仓储</span>
            </template>
            <el-submenu index="stockMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>库存中心</span>
              </template>
              <el-menu-item index="stock" @click="stock">库存查询</el-menu-item>
              <el-menu-item index="storageStock" @click="storageStock">仓库库存查询</el-menu-item>
              <el-menu-item index="seat" @click="seat">库位查询</el-menu-item>
              <el-menu-item index="snapshot" @click="snapshot">库位快照</el-menu-item>
              <el-menu-item index="log" @click="log">跟踪日志</el-menu-item>
              <el-menu-item index="adjust" @click="adjust">库存调整</el-menu-item>
              <el-menu-item index="CauExceSin" @click="CauExceSin">损益单</el-menu-item>
            </el-submenu>

            <el-submenu index="shelvesMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>策略中心</span>
              </template>
              <el-menu-item index="wave" @click="wave">波次策略</el-menu-item>
              <el-menu-item index="upShelves" @click="upShelves">上架策略</el-menu-item>
              <el-menu-item index="downShelves" @click="downShelves">下架策略</el-menu-item>
              <el-menu-item index="deliver" @click="deliver">发货流程</el-menu-item>
            </el-submenu>

            <el-submenu index="menuStock">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>出入库</span>
              </template>
              <el-menu-item index="outStock" @click="outStock">出库</el-menu-item>
              <el-menu-item index="ExamineGoods" @click="ExamineGoods">出库验货</el-menu-item>
              <el-menu-item index="inStock" @click="inStock">入库</el-menu-item>
            </el-submenu>

            <el-submenu index="changeStockMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>库内操作</span>
              </template>
              <el-menu-item index="enterShelves" @click="enterShelves">上架</el-menu-item>
              <el-menu-item index="change" @click="change">移位</el-menu-item>
              <el-menu-item index="replenishment" @click="replenishment">补货</el-menu-item>
              <el-menu-item index="inventory" @click="inventory">盘点</el-menu-item>
            </el-submenu>
          </el-submenu>

          <!--会员-->
          <el-submenu index="memBer">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>会员</span>
            </template>
            <el-submenu index="memberList">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>会员列表</span>
              </template>
              <el-menu-item index="memberList" @click="memberList">会员列表</el-menu-item>
            </el-submenu>
          </el-submenu>

          <!--设置-->
          <el-submenu index="setUpBox">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>设置</span>
            </template>
            <el-submenu index="warehouseMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>仓库</span>
              </template>
              <el-menu-item index="warehouse" @click="warehouse">仓库</el-menu-item>
              <el-menu-item index="storageLocation" @click="storageLocation">库位</el-menu-item>
              <el-menu-item index="storageFarm" @click="storageFarm">库区</el-menu-item>
            </el-submenu>

            <el-submenu index="argumentsMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>参数</span>
              </template>
              <el-menu-item index="autoWarehouse" @click="autoWarehouse">智能仓库</el-menu-item>
              <el-menu-item index="autoExpress" @click="autoExpress">智能快递</el-menu-item>
              <el-menu-item index="warehouseParam" @click="warehouseParam">仓库参数</el-menu-item>
              <el-menu-item index="warehouseProcesse" @click="warehouseProcesse">仓库流程</el-menu-item>
              <el-menu-item index="expressTemplate" @click="expressTemplate">快递单模板</el-menu-item>
              <el-menu-item index="serviceTemplate" @click="serviceTemplate">业务单模板</el-menu-item>
              <el-menu-item index="asStockSetup" @click="asStockSetup">同步库存设置</el-menu-item>
            </el-submenu>

            <el-submenu index="others">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>其他</span>
              </template>
              <el-menu-item index="diffReason" @click="diffReason">异常原因</el-menu-item>
            </el-submenu>
          </el-submenu>

          <!--增值-->
          <el-submenu index="incrementBox">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>增值</span>
            </template>
            <el-submenu index="plugMenu">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>插件</span>
              </template>
              <el-menu-item index="industrialization" @click="industrialization">行业化</el-menu-item>
            </el-submenu>
          </el-submenu>

        </el-menu>
      </div>
    </div>
</template>

<script>
export default {
  computed:{
    onRoutes(){
      return this.$route.path.replace('/','');//默认显示
    }
  },
  methods: {
    //商品
    asStock: function () {
      this.$router.push('/asStock')
    },
    batchQuery: function () {
      this.$router.push('/batchQuery')
    },
    batchSetup: function () {
      this.$router.push('/batchSetup')
    },
    CauExceSin:function(){
      this.$router.push('/CauExceSin')
   },
    //发货
    createWave: function () {
      this.$router.push('/createWave')
    },
    waveList: function () {
      this.$router.push('/waveList')
    },
    stockDiffBill: function () {
      this.$router.push('/stockDiffBill')
    },
    againSorting: function () {
      this.$router.push('/againSorting')
    },
    checkPackage: function () {
      this.$router.push('/checkPackage')
    },
    checkGoods: function () {
      this.$router.push('/checkGoods')
    },
    weigh: function () {
      this.$router.push('/weigh')
    },
    batchWeigh: function () {
      this.$router.push('/batchWeigh')
    },
    shipments: function () {
      this.$router.push('/shipments')
    },
    sendFailure: function () {
      this.$router.push('/sendFailure')
    },
    supplement: function () {
      this.$router.push('/supplement')
    },
    //会员
    memberList(){
      this.$router.push('/MemberList')
    },
    //仓储
    stock: function () {
      this.$router.push('/stock')
    },
    storageStock: function () {
      this.$router.push('/storageStock')
    },
    seat: function () {
      this.$router.push('/seat')
    },
    snapshot: function () {
      this.$router.push('/snapshot')
    },
    log: function () {
      this.$router.push('/log')
    },
    adjust: function () {
      this.$router.push('/adjust')
    },
    wave: function () {
      this.$router.push('/wave')
    },
    upShelves: function () {
      this.$router.push('/upShelves')
    },
    downShelves: function () {
      this.$router.push('/downShelves')
    },
    deliver: function () {
      this.$router.push('/deliver')
    },
    outStock: function () {
      this.$router.push('/outStock')
    },
    ExamineGoods: function () {
      this.$router.push('/ExamineGoods')
    },
    inStock: function () {
      this.$router.push('/inStock')
    },
    enterShelves:function () {
      this.$router.push('/enterShelves')
    },
    change: function () {
      this.$router.push('/change')
    },
    replenishment: function () {
      this.$router.push('/replenishment')
    },
    inventory: function () {
      this.$router.push('/inventory')
    },
    //设置
    warehouse: function () {
      this.$router.push('/warehouse')
    },
    storageLocation: function () {
      this.$router.push('/storageLocation')
    },
    storageFarm: function () {
      this.$router.push('/storageFarm')
    },
    autoWarehouse: function () {
      this.$router.push('/autoWarehouse')
    },
    autoExpress: function () {
      this.$router.push('/autoExpress')
    },
    warehouseParam: function () {
      this.$router.push('/warehouseParam')
    },
    warehouseProcesse: function () {
      this.$router.push('/warehouseProcesse')
    },
    expressTemplate: function () {
      this.$router.push('/expressTemplate')
    },
    serviceTemplate: function () {
      this.$router.push('/serviceTemplate')
    },
    diffReason: function () {
      this.$router.push('/diffReason')
    },
    asStockSetup: function () {
      this.$router.push('/asStockSetup')
    },
    //增值
    industrialization: function () {
      this.$router.push('/industrialization')
    },
  }
}
</script>

<!-- 本页css -->
<style scoped>
#aside{
  width: 95px;
  height: 100%;
  overflow: auto;
  background: #545c64;
  position:absolute;
  left: 0;
  top: 0;
  z-index: 9999;
}
#aside:hover{
  width: 180px;
}
#aside .el-submenu .el-menu-item{
  min-width: 100px;
}
#aside .el-menu{
  border-right: none;
}
</style>
