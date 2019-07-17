<!--波次策略 尘音-->
<template>
  <div>
    <!--主页-->
    <div id="wave" v-show="paramsObj.mainPageShow" @keyup.enter="search">
      <!--搜索区-->
      <div id="searchBox" style="margin-bottom: 10px">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="trueStock">生效仓库：</label>
                <el-select id="trueStock" v-model="storageId" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsStock"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="waveName">策略名称：</label>
                <el-input maxlength="50" id="waveName" v-model="waveStrategyName" placeholder=""></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="isUSe">启用状态：</label>
                <el-select id="isUSe" v-model="enabledFlag" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsUse"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox2">
          <el-button @click="search" size="mini" type="primary">查 询</el-button>
          <el-button @click="reset" size="mini" type="default">重 置</el-button>
        </div>
      </div>
      <!--操作导航-->
      <div class="col-nav" style="margin:-10px 0 10px;" v-if="authorityCode.WMS_WAVE_ADD">
        <ul>
          <li @click="addWave"><span>添加波次策咯</span></li>
        </ul>
      </div>
      <!--表格区-->
      <div class="pDown">
        <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column label="策略名称" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="waveDetail(scope.row)" href="javascript:">
                {{ scope.row.waveStrategyName }}
              </a>
            </template>
          </el-table-column>

          <el-table-column label="生效仓库" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.storageName }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="启用状态">
            <template slot-scope="scope">
              <el-switch v-if="authorityCode.WMS_WAVE_STATUS" v-model="scope.row.enabledFlag" @click.native="switchChange(scope.row)"></el-switch>
              <el-switch v-else disabled v-model="scope.row.enabledFlag" @click.native="switchChange(scope.row)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="执行时间">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.startTimeForShow|normalTime(3) }}~{{ scope.row.endTimeForShow|normalTime(3) }}</p>
            </template>
          </el-table-column>

          <el-table-column label="间隔时间（分钟）">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.intervalTime }}</p>
            </template>
          </el-table-column>

          <el-table-column label="更新人">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.updater }}</p>
            </template>
          </el-table-column>

          <el-table-column label="更新时间">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.updateTime|normalTime(6)}}</p>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="177" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.enabledFlag == false && authorityCode.WMS_WAVE_EDIT" @click="handleModifyClick(scope.row)" type="text" size="small">修改</el-button>
              <el-button v-if="scope.row.enabledFlag == false && authorityCode.WMS_WAVE_DEL" @click="handleDelClick(scope.row)" ref="del" type="text" size="small" style="color: red">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <!--查看-->
    <waveStrategyDetail
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1"
      :params="paramsObj"
      @changeShow="changeShow">
    </waveStrategyDetail>

    <!--添加-->
    <addWave
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 2"
      :params="paramsObj"
      @changeShow="changeShow">
    </addWave>

    <!--修改-->
    <changeWave
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 3"
      :params="paramsObj"
      @changeShow="changeShow">
    </changeWave>

  </div>

</template>
<script>
  import waveStrategyDetail from '@/components/views/stock/children/WaveStrategyDetail.vue'
  import addWave from '@/components/views/stock/children/AddWave.vue'
  import changeWave from '@/components/views/stock/children/ChangeWave.vue'
  export default {
    components: {
      waveStrategyDetail,addWave,changeWave
    },
    data() {
      return {
        version: '1.0.0',
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//生效仓库
        waveStrategyName: '',//波次名称
        optionsUse: [{//启用状态下拉
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '停用'
        }],
        enabledFlag: '',//启用状态

        table_h: 0,//表格高度
        tableData: [],//表格数据

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限

        paramsObj: {
          mainPageShow: true
        }//子级传参
      }
    },
    mounted() {
      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 35);
      })
    },

    methods: {

      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val.isRefresh){
          this.initMessage();
        }
        this.paramsObj.mainPageShow = true;
      },

      //重置
      reset: function () {
        this.storageId = '';
        this.waveStrategyName = '';
        this.enabledFlag = ''
      },

      //查询
      search: function () {
        this.initMessage();
      },

      //初始化仓库下拉
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsStock.push({value: val.storageId,label: val.storageName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this));
      },

      //初始化表格数据
      initMessage: function () {
        let data = {
          storageId: this.storageId,
          waveStrategyName: this.waveStrategyName,
          enabledFlag: this.enabledFlag
        };
        this._post('com.edb01.erp.wms.service.api.WmWaveStrategyService/' + this.version + '/list',data).then(function (res) {
          if(res.data.success) {
            this.tableData = res.data.result;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //启用状态接口
      initSwitchChange: function (row) {
        let data = {
          waveStrategyId: row.waveStrategyId,
          enabledFlag: row.enabledFlag
        };
        this._post('com.edb01.erp.wms.service.api.WmWaveStrategyService/' + this.version + '/updateStatus',data)
          .then(function (res) {
            if(res.data.success) {
              this.initMessage()
            }else {
              this.$alert(res.data.msg, {
                type: 'warning',
                center: true,
                confirmButtonText: '确定'
              });
              this.initMessage()
            }
          }.bind(this)
        )
      },

      //删除接口
      initDelete: function (row) {
        let data = {
          waveStrategyId: row.waveStrategyId
        };
        this._post('com.edb01.erp.wms.service.api.WmWaveStrategyService/' + this.version + '/deleteWmwaveStrategy',data)
          .then(function (res) {
            if(res.data.success) {
              this.$alert("删除波次策咯成功", {
                type: 'success',
                center: true,
                confirmButtonText: '知道了',
                callback: action => {
                  this.initMessage()
                }
              });
            }else {
              this.$alert("删除波次策咯失败", {
                type: 'info',
                center: true,
                confirmButtonText: '知道了',
              });
            }
          }.bind(this))
      },

      //波次点击查看详情
      waveDetail: function (row) {
//        this.$router.push('/waveStrategyDetail/' + row.waveStrategyId)

        //给子级传参并显示子级
        this.paramsObj = {
          waveStrategyId: row.waveStrategyId,
          childrenShow: 1,
          mainPageShow: false
        }
      },

      //启用状态
      switchChange: function (row) {
        this.initSwitchChange(row)
      },

      //点击修改
      handleModifyClick: function (row) {

//        this.$router.push('/changeWave/' + row.waveStrategyId)

        //给子级传参并显示子级
        this.paramsObj = {
          waveStrategyId: row.waveStrategyId,
          childrenShow: 3,
          mainPageShow: false
        }

      },

      //添加波次策咯
      addWave: function () {
//        this.$router.push('/addWave')

        //给子级传参并显示子级
        this.paramsObj = {
          childrenShow: 2,
          mainPageShow: false
        }
      },

      //点击删除
      handleDelClick: function (row) {
        this.$confirm('确认要删除此订单波次策咯吗?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
        }).then(() => {
          this.initDelete(row);

        }).catch(() => {});
      },
    }
  }
</script>
