<!--系统公告详情 秋香-->
<template>
  <div id="SubjectContent">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/IndexBis' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/HistoryPage' }">系统公告</el-breadcrumb-item>
        <el-breadcrumb-item>公告详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
     <span style="margin-left: 20px">{{sysNotiTheme}}</span>
    </div>
    <div v-html="sysNotiContent"></div>
    <!--footer-->
    <div class="wmsFoot">
      <el-button @click="backClick" size="mini" type="info">返 回</el-button>
    </div>

  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    components: {
      pagination,dataTime
    },
    data(){
      return{
        version: '1.0.0',
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        sysNotiTheme:'',//主题
        sysNotiContent:'',//内容
      }
    },
    mounted(){
      //初始化每页数量
      if(sessionStorage.getItem("hold_change_1") != null) {
        this.pageSize = parseInt(sessionStorage.getItem("hold_change_1"));
      }
      this.findShop(); //店铺查询
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods:{

      //点击返回
      backClick: function () {
        this.$router.push('/HistoryPage')
      },

      //列表查询
      findShop(){
        let data = {
          "sysNotiId":this.$router.history.current.params.sysNotiId
        };
        this._post('com.edb01.erp.bis.service.api.BisSysNoticeService/'+this.version+'/queryById',data).then(function (res) {
          this.sysNotiTheme=res.data.result.sysNotiTheme;
          this.sysNotiContent=res.data.result.sysNotiContent;
          this.sysNotiContent=res.data.result.sysNotiContent.replace(/\n/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

        }.bind(this))
      },

      // 关闭平台授权弹框
      handleClose() {
        this.centerP = false;
        window.clearInterval(this.timer);
      },

      //以下是分页
      getPageSize: function (val) {
        if(val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.findShop();
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.findShop()
        }
      },


    }
  }
</script>
<style scoped>
  .pTop{
    margin-bottom: 20px;
  }
  /*其他*/
  .wmsFoot{
    text-align: center;
    position: fixed;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 20px 50px;
    width: 100%;
    margin: 0!important;
    border-top: 15px solid #F0F1F5;
    z-index: 999;
  }
</style>
<style>

</style>
