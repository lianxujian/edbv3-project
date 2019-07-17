<!--发票管理-发票档案设置 樊虎-->
<template>
  <div id="invoicesControlSetting">
    <!--面包屑导航-->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="col-breadcrumb">
        <el-breadcrumb-item @click.native="showParentBlock">{{$t("receipt.receiptMain")}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t("receipt.receiptSetting")}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--主数据多页签区-->
    <div style="margin-top: 20px">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane :label="$t('receipt.receiptBasic')" name="first">
          <receipt-basic ref="rsb"  :tabHeight="tabHeight"></receipt-basic>
        </el-tab-pane>
        <el-tab-pane :label="$t('receipt.receiptTax')" name="second">
          <receipt-tax ref="rst" :tabHeight="tabHeight"></receipt-tax>
        </el-tab-pane>
        <el-tab-pane :label="$t('receipt.receiptRate')" name="third">
          <receipt-rate ref="rsr" :tabHeight="tabHeight"></receipt-rate>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import ReceiptBasic from './InvoicesControlSettingBasic'
  import ReceiptTax from './InvoicesControlSettingTax'
  import ReceiptRate from './InvoicesControlSettingRate'

  export default {
    components: {
      ReceiptRate,
      ReceiptTax,
      ReceiptBasic
    },
    name: 'receipt-setting',
    data() {
      return {
        activeName:'first',//面包屑activeName
        tabHeight: 100,//表格高度
      }
    },
    created() {
      this.$nextTick(() => {
        this.onResize()
      })
    },
    mounted() {
      window.onresize = () => {
        this.onResize()
      }
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode == 13) { // enter 键
          //调接口
          if (this.activeName == 'first') {
            this.$refs.rsb.getList();
          } else if (this.activeName == 'second') {
            this.$refs.rst.getList();
          } else if (this.activeName == 'third') {
            this.$refs.rsr.getList();
          }
        }
      }
    },
    methods: {
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tab_setting').offsetTop
        if (clientHeight - this.tableTop - 180 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 180
        } else {
          this.tabHeight = 100
        }
      },
      //返回到发票管理页
      showParentBlock() {
        //this.$router.push({name: 'invoicesControl'});
        this.$emit('changeShow');
      }
    }
  }
</script>
