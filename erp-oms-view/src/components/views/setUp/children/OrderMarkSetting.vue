<!--订单标记-规则设置 方证/樊虎-->
<template>
  <div id="orderMarkSetting">
    <!--面包屑导航-->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="col-breadcrumb">
        <el-breadcrumb-item @click.native="showParentBlock">{{$t("orderSign.signSetting")}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t("orderSign.ruleSetting")}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--规则属性区-->
    <div>
      <div style="margin-top: 20px;">
        <span style="margin-right: 20px">{{$t("orderSign.effectiveShop")}}</span>
        <!--<el-select v-model="shopSetting" multiple collapse-tags clearable filterable style="width: 400px;">
          <el-option v-for="item in shoplist" :key="item.shopId" :label="item.shopName" :value="item.shopId">
          </el-option>
        </el-select>-->
        <select id="mulshop" name="multiselect[]" multiple="multiple">
          <option v-for="item in shoplist" :value="item.storeId">{{item.storeName}}</option>
        </select>
      </div>
      <p style="margin-top: 10px;color: #FEA462;">{{$t("orderSign.settingFlag")}}</p>
      <div  style="margin-top: 10px;height:30px;line-height: 30px;">
        <span style="margin-right: 20px">{{$t("orderSign.msgSetting")}}</span>
        <!--<el-select v-model="msgRulesType" collapse-tags style="width: 200px;">
          <el-option :key=1 :label="$t('orderSign.msgEqual')" :value=1></el-option>
          <el-option :key=2 :label="$t('orderSign.msgContain')" :value=2></el-option>
        </el-select>
        <el-input v-model="msgRulesText" style="width: 400px;">
        </el-input>-->
        <el-input v-model="msgRulesText" :maxlength="500" style="width: 400px;">
          <el-select v-model="msgRulesType" collapse-tags slot="prepend" style="width: 120px;">
            <el-option :key=1 :label="$t('orderSign.msgEqual')" :value=1></el-option>
            <el-option :key=2 :label="$t('orderSign.msgContain')" :value=2></el-option>
          </el-select>
        </el-input>
        <el-tooltip :content="$t('orderSign.msgContent')" placement="right-start">
          <i style="font-size:16px;" class="el-icon-question" ></i>
        </el-tooltip>
      </div>
    </div>

    <!--主数据多页签区-->
    <div style="margin-top: 20px;">
      <!--tab-position="left"-->
      <el-tabs id="tabConfig" v-model="activeTab" type="border-card">
        <el-tab-pane :label="$t('orderSign.cfgAddress')" name="address">
          <sign-config ref="address" type="1" :typeName="$t('orderSign.cfgAddress')" @refresh="refresh" :tabHeight="tabHeight"></sign-config>
        </el-tab-pane>
        <el-tab-pane :label="$t('orderSign.cfgBuyer')" name="buyer">
          <sign-config ref="buyer" type="2" :typeName="$t('orderSign.cfgBuyer')" @refresh="refresh" :tabHeight="tabHeight"></sign-config>
        </el-tab-pane>
        <el-tab-pane :label="$t('orderSign.cfgMobile')" name="mobile">
          <sign-config ref="mobile" type="3" :typeName="$t('orderSign.cfgMobile')" @refresh="refresh" :tabHeight="tabHeight"></sign-config>
        </el-tab-pane>
        <el-tab-pane :label="$t('orderSign.cfgOutorder')" name="outorder">
          <sign-config ref="outorder" type="4" :typeName="$t('orderSign.cfgOutorder')" @refresh="refresh" :tabHeight="tabHeight"></sign-config>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--操作区-->
    <div slot="footer" align="center" style="margin-top: 20px">
      <el-button @click="showParentBlock" plain>{{$t('orderSign.onCancel')}}</el-button>
      <el-button @click="confirmEdit" type="primary">{{$t('orderSign.onOk')}}</el-button>
    </div>
  </div>
</template>

<script>
  //  getSignSetting, getConfigSetting, 优化合并 getSignSettingEx
  //import { fetchShoplist, getSignSettingEx, updateSignSetting } from '@/api/orderSign'
  import SignConfig from '@/components/views/setUp/children/OrderMarkSetConfig'

  export default {
    name: 'signSetting',
    components: {
      SignConfig
    },
    data() {
      return {
        apiVersion: '1.0.0',
        shoplist: [],//店铺集合
        shopSetting: [],//选中的店铺
        msgRulesType: 1,//买家留言设置下拉
        msgRulesText: '',//买家留言设置输入框
        activeTab: 'address',//面包屑tab
        listQuery: {
          page: 1,
          size: 15
        },//表格分页查询条件
        tabHeight: 100,
        signId:this.$router.history.current.params.signId,//订单标记id
        type:this.$router.history.current.params.type,//是否来自订单处理
      }
    },
    created() {
      //初始化表格数据
      this.initSetting(this.signId)
      this.$nextTick(() => {
        this.onResize()
      })
    },
    mounted() {
      // 生效店铺设置
      $('#mulshop').multiselect({
        onInitialized: function(select, container) {
          $("._scroll").yi_scroll();
        }
      });

      window.onresize = () => {
        this.onResize()
      }
    },
    methods: {
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tabConfig').offsetTop
        if (clientHeight - this.tableTop - 262 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 262
        } else {
          this.tabHeight = 100
        }
      },
      //跳转到订单标记页
      showParentBlock() {
        this.$router.push({name: 'orderMarks',params:{type:this.type}});
      },
      //刷新数据
      refresh(val){
        this.initSetting(this.signId,val);
      },
      //初始化表格数据
      initSetting(signId,item) {
        this.signId = signId
        this.shopSetting = []
        if(item){
          switch(item){
            case 1:
              this.activeTab = 'address';
              break;
            case 2:
              this.activeTab = 'buyer';
              break;
            case 3:
              this.activeTab = 'mobile';
              break;
            case 4:
              this.activeTab = 'outorder';
              break;
          }
        }else{
          this.activeTab = 'address'
        }
        //fetchShoplist()
        //参与店铺下拉
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.apiVersion + '/list').then(response => {
          if (response.data.success === true) {
            this.shoplist = response.data.result
            this.shoplist.forEach((item,i)=>{
              item.value=item.storeId;
              item.label=item.storeName;
              //this.shopSetting.push(item.value);
            })
            $('#mulshop').multiselect('dataprovider', this.shoplist);
            $('#mulshop').multiselect('select',this.shopSetting);
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })

        this.listQuery.signId = this.signId
        //getSignSettingEx(this.listQuery)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/getPageOrderSignCustomer',this.listQuery).then(response => {
          if (response.data.success === true) {
            if(response.data.result.base){
              const _item = response.data.result.base.storeCheckedList;
              this.shopSetting = _item.map(v => v.storeId);
              $('#mulshop').multiselect('select',this.shopSetting);
              this.msgRulesType = response.data.result.base.msgRulesType
              this.msgRulesText = response.data.result.base.msgRulesText
            }
            if (this.msgRulesType === undefined) {
              this.msgRulesType = 1
            }
            if (this.msgRulesText === undefined) {
              this.msgRulesText = ''
            }
            this.$refs.address.listQuery = JSON.parse(JSON.stringify(this.listQuery))
            this.$refs.buyer.listQuery = JSON.parse(JSON.stringify(this.listQuery))
            this.$refs.mobile.listQuery = JSON.parse(JSON.stringify(this.listQuery))
            this.$refs.outorder.listQuery = JSON.parse(JSON.stringify(this.listQuery))

            this.$refs.address.initConfig(signId, response.data.result.option.listAddress)
            this.$refs.buyer.initConfig(signId, response.data.result.option.listBuyId)
            this.$refs.mobile.initConfig(signId, response.data.result.option.listMobile)
            this.$refs.outorder.initConfig(signId, response.data.result.option.listOuterId)
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //保存规则设置
      confirmEdit() {
        const _item = { signId: this.signId, msgRulesType: this.msgRulesType, msgRulesText: this.msgRulesText }
        //_item.shopIds = this.shopSetting.toString()
        _item.storeId = $('#mulshop').val()
        //updateSignSetting(_item)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/saveOrderSignCustomerBaseInfo',_item).then(response => {
          if (response.data.success !== true) {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            })
          } else {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.$router.push({name: 'orderMarks',params:{type:this.type}});
          }
        })
      }
    }
  }
</script>
