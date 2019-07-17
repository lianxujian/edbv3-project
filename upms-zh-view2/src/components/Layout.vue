<template>
  <div class="layout">
    <el-container id="main_con" :style="{height: '{{clientHeight}}px'}">
      <el-header style="text-align: left; font-size: 12px;">
        <div class="systitle">圣特尔综合管理系统</div>
        <div style="float: right;">
          <el-dropdown>
            <i class="fa fa-android" style="margin-right: 20px; color: #fff;font-size: 26px;cursor: pointer"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span style="margin-left: -10px;">王某</span>
        </div>
      </el-header>
      <el-container>
        <el-aside class="aside" width="226px" style="background-color: rgb(238, 241, 246);">
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :default-openeds='dataOpen'
            background-color="#1F2D3D"
            text-color="#fff"
            active-text-color="#409EFF">
            <el-submenu v-for="(item,index) in menuData" :key="index" :index="item.privilegeId"><!--:default-active="editableTabsValue2"-->
              <template v-if="item.nodes.length>0" slot="title"><i
                :class="item.icon"></i><span>{{item.privilegeName}}</span>
              </template>

              <el-menu-item v-if="item.nodes.length>0&&item2.nodes.length==0" v-for="(item2, index2) in item.nodes"
                            :key="index2" :index="item2.privilegeId"
                            @click="addTab(item2.privilegeName,item2.privilegeId,item2.appServerName+'/'+item2.programCode)">
                {{item2.privilegeName}}
              </el-menu-item>

              <el-submenu v-if="item.nodes.length>0&&item2.nodes.length>0" v-for="(item2, index2) in item.nodes"
                          :key="index2" :index="item2.privilegeId">
                <template slot="title"><i
                  :class="item2.icon"></i><span>{{item2.privilegeName}}</span>
                </template>

                <el-menu-item v-if="item2.nodes.length>0&&item3.nodes.length==0" v-for="(item3, index3) in item2.nodes" :key="index3"
                              @click="addTab(item3.privilegeName,item3.privilegeId,item3.appServerName+'/'+item3.programCode)"
                              :index="item3.privilegeId">{{item3.privilegeName}}
                </el-menu-item>
                <el-submenu v-if="item2.nodes.length>0&&item3.nodes.length>0" v-for="(item3, index3) in item2.nodes"
                            :key="index3" :index="item3.privilegeId">
                  <template slot="title"><i :class="item3.icon"></i><span>{{item3.privilegeName}}</span></template>
                  <el-menu-item v-if="item3.nodes.length>0&&item4.nodes.length==0" v-for="(item4, index4) in item3.nodes" :key="index4"
                                @click="addTab(item4.privilegeName,item4.privilegeId,item4.appServerName+'/'+item4.programCode)"
                                :index="item4.privilegeId">{{item4.privilegeName}}
                  </el-menu-item>

                  <el-submenu v-if="item3.nodes.length>0&&item4.nodes.length>0" v-for="(item4, index4) in item3.nodes"
                              :key="index4" :index="item4.privilegeId">
                    <template slot="title"><i :class="item4.icon"></i><span>{{item4.privilegeName}}</span></template>
                    <el-menu-item v-for="(item5, index5) in item4.nodes" :key="index5"
                                  @click="addTab(item5.privilegeName,item5.privilegeId,item5.appServerName+'/'+item5.programCode)"
                                  :index="item5.privilegeId">{{item5.privilegeName}}
                    </el-menu-item>
                  </el-submenu>
                </el-submenu>
              </el-submenu>


              <el-menu-item v-if="item.nodes.length==0" @click="addTab(item2.privilegeName,item2.privilegeId,item2.appServerName+'/'+item2.programCode)"
                            :index="item2.privilegeId"><i class="el-icon-menu"></i><span
                slot="title">{{item.privilegeName}}</span>
              </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>

        <el-main class="mainwap">
          <el-button type="" @click="fullScreen()" id="fullBut" size="small" icon="el-icon-rank"
                     style="position: relative; z-index: 100; float: right; top: 6px; right: 3px;margin: 0px 0px 0px 2px;"></el-button>

          <el-tabs v-model="editableTabsValue2" type="card" :closable=false @tab-click="handleClick"
                   @tab-remove="removeTab">
            <el-tab-pane
              v-for="(item, index) in editableTabs2"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              :closable=item.closable
              v-html="item.content"
            >
              {{item.content}}
            </el-tab-pane>

          </el-tabs>

        </el-main>
      </el-container>

      <!--<el-footer class="elfooter">
        <div style="text-align: center">Copyright©2004-2016 edb01-UPMS.com 版权所有</div>
      </el-footer>-->
    </el-container>
  </div>
</template>

<script>
  var TOP_HEIGHT = 88;
  var FOTTER_HEIGHT = 30;
  export default {
    name: 'Layout',
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item),
        sysUserAvatar: '',
        sysUserName: '',
        arr: ['lianxujian'],
        clientHeight: 600,
        dataOpen: ['0'],
        editableTabsValue2: 'lianxujian',
        editableTabs2: [{
          title: '首页',
          name: 'lianxujian',
          closable: false,
          content: '<iframe class="tab-iframe" src="" width="100%"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes" ></iframe>'
        }],
        tabIndex: 1,
        menuData: []
      };

    },
    beforeCreate() {
      this.$nextTick(function () {
        var clientHeight = document.body.clientHeight // 页面高度
        var clientHeight = document.documentElement.clientHeight;
        document.querySelector('body').setAttribute('style', 'margin:0px;height:' + clientHeight + 'px;');
      })

    },
    mounted() {
      var clientHeight = document.documentElement.clientHeight;
      document.querySelector('#main_con').setAttribute('style', 'height:' + (clientHeight) + 'px;');
      document.querySelector('.tab-iframe').setAttribute('style', 'height:' + (clientHeight - TOP_HEIGHT - FOTTER_HEIGHT) + 'px;');
      document.querySelector('.el-tabs__header').setAttribute('style', 'margin:0px;');


      this.clientHeight = document.documentElement.clientHeight;
      const that = this;
      window.onresize = function temp() {
        that.clientHeight = document.documentElement.clientHeight;
        document.querySelector('body').setAttribute('style', 'margin:0px;height:' + that.clientHeight + 'px;');
        document.querySelector('#main_con').setAttribute('style', 'height:' + (that.clientHeight) + 'px;');
        //document.querySelector('.tab-iframe').setAttribute('style', 'height:'+(that.clientHeight-TOP_HEIGHT-FOTTER_HEIGHT)+'px;');
      };
      var user = localStorage.getItem('user');
      if (user) {
        this.sysUserName = user.name || '';
        this.sysUserAvatar = user.avatar || '';
      }
    },
    beforeDestroy() {
      //document.querySelector('body').setAttribute('style', '')
    },
    methods: {
      // 退出
      logout() {
        this.$router.push({path: '/'})
        localStorage.removeItem('user')
        localStorage.removeItem('clToken')
      },
      // 增加tab
      addTab(tabName, tabId, url) {
        console.log(url)
        for (var i = 0; i < this.arr.length; i++) {
          if (this.arr[i] == tabId) {
            this.editableTabsValue2 = tabId;
            return false
          }
        }
        this.arr.push(tabId)
        this.editableTabs2.push({
          title: tabName,
          name: tabId,
          closable: true, // process.env.API_URL
          content: '<iframe class="tab-iframe" src="'+ process.env.API_URL + url + '" width="100%" height="' + (this.clientHeight - TOP_HEIGHT - FOTTER_HEIGHT) + '"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes" ></iframe>'
        });
        this.editableTabsValue2 = tabId;
        /*var clientHeight=document.documentElement.clientHeight;
        document.querySelector('.tab-iframe').setAttribute('style', 'height:'+(clientHeight-TOP_HEIGHT-FOTTER_HEIGHT)+'px;');
        $(".tab-iframe").css("height",(clientHeight-TOP_HEIGHT-FOTTER_HEIGHT));
        console.log($(".tab-iframe").height());
        console.log(clientHeight);*/
      },
      handleClick(tab, event) {
        this.editableTabsValue2 = this.arr[tab.index];
        //console.log(this.arr[tab.index]);
      },
      // 删除tab
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        let ind = this.arr.indexOf(activeName);
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            //this.arr.splice(index,1);
            //tabs.splice(index,1);
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if ((index == ind - 1 || index == ind) && nextTab) {
              this.editableTabsValue2 = nextTab.name;
            }
          }
        });
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
        this.arr = this.arr.filter(tab => tab !== targetName);
      },
      // 展开下拉菜单
      handleOpen(key, keyPath) {
        // this.dataOpen.push(key[0])
          // console.log(key, keyPath);
        console.log(this.dataOpen);
      },
      // 关闭下拉菜单
      handleClose(key, keyPath) {
        // this.dataOpen.push(key)
        console.log(1);
        //console.log(key, keyPath);
      },
      fullScreen() {
        var element = document.documentElement;
        if (!$('body').hasClass("full-screen")) {
          $('body').addClass("full-screen");
          $('#fullBut').addClass("active");
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }

        } else {
          $('body').removeClass("full-screen");
          $('#fullBut').removeClass("active");
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      }

    },
    created() {
      let self = this
      self.$axios({
        method: 'post',
        url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/1.0.0/getUserPrivilege',
        data: {clToken: encodeURIComponent(localStorage.getItem('clToken'))},
        transformRequest: [function (data) {
          let newData = ''
          for (var k in data) {
            newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
          }
          return newData
        }]
      })
        .then(function (res) {
          if (res.data.code == 0) {
            self.menuData = res.data.result.nodes
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(function (err) {
          console.log(err);
        })

    }
  }
</script>

<style scoped>
  *{
    font-size: 13px;
  }
  .el-header {
    background-color: #0072c6;
    color: #fff;
    line-height: 50px;
    height: 50px !important;
  }

  .el-aside {
    color: #333;
  }
  .aside .el-submenu__title{
    width:226px;
    background-color: rgb(48,65,86) !important;
  }
  .aside i{
    font-size: 12px;
  }
  .mainwap {
    padding:0px !important;
  }

  .mainin {
    padding: 0px;
  }

  .mainheader {
    background: #ccc;
    height: 40px !important;
  }

  .elfooter {
    height: 30px !important;
    background: rgb(48,65,86) !important;
    font-size: 12px;
    text-align: right;
    line-height: 30px;
    color: #eee;
  }

  .tab-iframe {
    margin: 0px 0px -5px 0px;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
    width: 14px !important;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid #ddd;

  }

  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background: #fff;
  }

  .el-tabs__item {
    line-height: 30px !important;
    height: 30px !important;
  }

  .el-tabs__nav-prev {
    left: 0;
    height: 30px;
    line-height: 30px;
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }

  .el-tabs__nav-next {

    height: 30px;
    line-height: 30px;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
  }

  .el-tabs--card > .el-tabs__header {
    border: 1px solid #ddd;
    padding: 5px 0px 0px 0px;
    background: #f3f3f3;
  }

  .el-aside {
    text-align: left;
    background-color: rgb(48,65,86) !important;
  }

  .el-menu {
    border-right: 1px solid rgb(48,65,86);
  }

  .systitle {
    float: left;
    font-size: 18px;
    font-weight: bold;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background: #42B983;
    color:#fff !important;
    border-bottom-color: #fff;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: none;
    /* background: red; */
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #e4e7ed !important;
    border-left: 1px solid #e4e7ed;
    -webkit-transition: color .3s cubic-bezier(.645, .045, .355, 1), padding .3s cubic-bezier(.645, .045, .355, 1);
    transition: color .3s cubic-bezier(.645, .045, .355, 1), padding .3s cubic-bezier(.645, .045, .355, 1);
  }

  .el-tabs__item.is-active {
    color: #fff;
  }

  .el-tabs__item {
    line-height: 33px !important;
    height: 30px !important;
  }

  .el-tabs--card > .el-tabs__header {
    border: 1px solid #ddd;
   /* padding: 0px 0px 0px 0px;*/
    background: #fff;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    margin: 3px 0;
  }
</style>

