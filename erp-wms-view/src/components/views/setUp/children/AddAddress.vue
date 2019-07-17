<!--贾南风 添加属地仓-->
<template>
	<div id="addAddress">
		<div>
			<el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
          <el-breadcrumb-item :to="{name: 'autoWarehouse'}">智能仓库设置</el-breadcrumb-item>
          <el-breadcrumb-item :to="{name: 'storeSetup',params:{state: false,intellectStorageId:this.$router.history.current.params.intellectStorageId}}">属地仓设置</el-breadcrumb-item>
          <el-breadcrumb-item>添加收货区域</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="box">
			<label>收货区域：</label>
			<el-input v-model="addData.areaName" placeholder="请输入收货区域，例如：北方大区" :maxlength="100" style="width:400px;"></el-input>
		</div>
		<div class="box box1">
			<span>覆盖省市：</span><span>{{regionName}}</span><span style="color: #409EFF;cursor: pointer" @click="dialogTable()">设置覆盖城市</span>
		</div>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addButton"><span>添加仓库</span></li>
      </ul>
    </div>
		<div id="tabBox">
      <div class="alertBox" style="float:left;margin-left:22px;">
        <el-tooltip class="item" effect="dark" content="优先级数值越小，优先级越高。"placement="right-start">
          <i style="font-size:16px;cursor:pointer;float:right;margin:12px 0 0 1px;" class="el-icon-question" />
        </el-tooltip>
      </div>
			<el-table :data="tableData" id="fitTable" :height="table_h" border style="width: 100%">
				<el-table-column align="center"  label="优先级"  width="100">
          <template slot-scope="scope">
           <span>{{scope.$index + 1}}</span>
          </template>
				</el-table-column>

				<el-table-column align="center" width="360" label="仓库名称">
					<template slot-scope="scope">
						<el-select v-model="scope.row.storageId" placeholder="请选择" style="width: 180px;">
							<el-option v-for="item in options" :key="item.storageId" :label="item.storageName" :value="item.storageId">
							</el-option>
						</el-select>
						<div class="box8" style="margin: 0 20px;">
							<i v-if="scope.$index == 0" style="font-size: 22px;font-weight: bold;color: #D8D8D8" class="el-icon-upload2"></i>
							<i v-else style="font-size: 22px;font-weight: bold;color: #F9A946;cursor: pointer" class="icon iconfont icon-xiaoliangjiantou" @click="upOne(tableData,scope.$index)"></i>
						</div>
						<div class="box8">
							<i v-if="scope.$index == tableData.length-1" style="font-size: 22px;font-weight: bold;color: #D8D8D8" class="el-icon-download"></i>
							<i v-else style="font-size: 22px;font-weight: bold;color: #2FA1FA;cursor: pointer" class="icon iconfont icon-down" @click="downOne(tableData,scope.$index)"></i>
						</div>
					</template>
				</el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteStore(scope.$index)" style="color: red">删除</el-button>
          </template>
        </el-table-column>
				<el-table-column>
				</el-table-column>
				<el-table-column>
				</el-table-column>
			</el-table>
		</div>
		<!--成功弹出框-->
		<div>
			<el-dialog v-dialogDrag :visible.sync="centerDialogVisible" width="30%" center>
				<div class="boxt"><i style="font-size: 30px;color: #65F007;margin-top: -10px" class="el-icon-success"></i> </div>
				<div class="boxt" style="font-size: 18px;margin: 5px 0 -10px 0;">添加成功！</div>
				<span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="goonAdd()">继续添加</el-button>
          <el-button @click="backPage">返回列表</el-button>
  </span>
			</el-dialog>
		</div>
		<!--设置覆盖城市-->
		<div>
			<el-dialog v-dialogDrag title="设置覆盖城市" :visible.sync="dialogTableVisible" width="795px">
				<el-table :data="gridData" border :height="312" style="margin-top: -30px;">
					<el-table-column width="95">
						<template slot-scope="scope">
							<el-checkbox  :indeterminate="scope.row.indeterminate" :disabled="scope.row.disabled" v-model="scope.row.areaId" style="margin-left: 8px" @change="handleCheckAllChange(scope.row)">{{scope.row.areaName}}</el-checkbox>
						</template>
					</el-table-column>
					<el-table-column width="598">
						<template slot-scope="scope">
							<el-checkbox   style="color: #101010" v-for="(city,index) in scope.row.regionBeanList" :disabled="city.disabled" v-model="city.check" :key="index"  @change="clickData(scope.row)">{{city.regionName}}</el-checkbox>
						</template>
					</el-table-column>
				</el-table>
				<div class="box2" style="margin: 5px;">同一个覆盖省市只能存在一个收货区域内</div>
				<div class="box2">
					<el-button type="primary" @click="log()">确认设置</el-button>
				</div>
			</el-dialog>
		</div>
		<div style="width: 100%;text-align: center;margin-top: 10px; ">
			<el-button type="primary" @click="saveData()">保 存</el-button>
			<el-button @click="backPage">返 回</el-button>
		</div>
	</div>
</template>

<script>
  export default {
    data() {
      return {
        table_h: 0, //高度
        version: '1.0.0',//版本号
        query: () => {//方法
        },
        queryF: () => {//方法
        },
        tableData: [],//表格数据接收
        addData: { // 添加的参数
          intellectStorageId: this.$router.history.current.params.intellectStorageId,// 智能仓库设置ID
          areaName: '', //属地仓大区名称
          regionIds: '',//地区ID，多个地区“，” 分割
          wmDSstoragesJson: [], //仓库信息
        },
        id: this.$router.history.current.params.id,//路由ID
        regionId: [], // 选择城市的ID
        options: [],//仓库
        dog: 0,//看门狗
        gridData: [],//城市
        dialogTableVisible: false,//城市弹框
        centerDialogVisible: false,// 添加成功
        //dialogVisible: false,//
        regionName: '',//城市姓名
        dog1: 0,////看门狗
        temp: []//大区地址
      }
    },
    methods: {
      // 返回上一页
      backPage() {
        this.$router.push({name: 'storeSetup',params:{state: false,intellectStorageId:this.addData.intellectStorageId}})
      },
      // 点击城市
      clickData(row) {
        this.gridData[0].areaId = !this.gridData[0].areaId
        this.gridData[0].areaId = !this.gridData[0].areaId
        var j = 0;
        for (var i=0;i<row.regionBeanList.length;i++) {
          if ( row.regionBeanList[i].check == true) {
            j++
          }
        }
        if (row.regionBeanList.length == j) {
          row.areaId = true
          row.indeterminate = false
        } else if(j < row.regionBeanList.length && j >0) {
          row.indeterminate = true
        }else if(j == 0) {
          row.areaId = false
          row.indeterminate = false
        }
      },
      // 点击大区
      handleCheckAllChange(row) {
        if (row.areaId == false) {
          row.indeterminate = false
          for (var i = 0; i < row.regionBeanList.length; i++) {
            row.regionBeanList[i].check = false
          }
        }
        if (row.areaId == true) {
          row.indeterminate = false
          for (var i = 0; i < row.regionBeanList.length; i++) {
            row.regionBeanList[i].check = true
          }
        }
        //self.isIndeterminate =  false
      },
    /*  // 收货区域超出部分截取
      strSub() {
        if (this.addData.areaName.length > 10) {
          this.addData.areaName = this.addData.areaName.substr(0, 10)
        }
      },*/
      // 点击保存
      saveData() {
        let self = this
        if (self.addData.areaName.trim() == '') {
          self.$message({
            message: '请输入收货区域',
            type: 'warning'
          });
          return false
        }
        if (self.regionName == '') {
          self.$message({
            message: '请选择省市',
            type: 'warning'
          })
          return false
        }
        if (self.tableData.length == 0) {
          self.$message({
            message: '请添加仓库',
            type: 'warning'
          })
          return false
        }
        for (let k = 0; k < self.tableData.length; k++) {
          if (self.tableData[k].storageId == '') {
            self.$message({
              message: '请选择仓库',
              type: 'warning'
            })
            return false
          }
          //把所有相同的仓库对比
          for(var g=0;g<self.tableData.length;g++){
            if(k<g) {
              if(self.tableData[k].storageId == self.tableData[g].storageId){
                self.$message({
                  message: '同一仓库不可有不同优先级！',
                  type: 'warning'
                })
                return false
              }
            }
          }
        }
        for (let k = 0; k < self.tableData.length; k++) {
          self.addData.wmDSstoragesJson.push({ storageId: self.tableData[k].storageId, pri: k + 1 })
        }
        self.addData.wmDSstoragesJson = JSON.stringify(self.addData.wmDSstoragesJson);
        self.addData.regionIds = '';
        for (var j = 0; j < self.gridData.length; j++) {
          for (var i = 0; i < self.gridData[j].regionBeanList.length; i++) {
            if (self.gridData[j].regionBeanList[i].check == true && this.gridData[j].regionBeanList[i].disabled == false) {
              self.addData.regionIds += self.gridData[j].regionBeanList[i].regionId + ','
            }
          }
        }
        self.addData.regionIds = self.addData.regionIds.slice(0,-1);
          self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/saveWmdependentStorage', self.addData)
            .then(function (res) {
              if (res.data.success == true) {
                self.centerDialogVisible = true;
              } else {
                self.$message({
                  message: res.data.msg, // 如果code为其他，弹出错误码
                  type: 'warning'
                });
                self.addData.wmDSstoragesJson = JSON.parse(self.addData.wmDSstoragesJson)
              }
            })
      },
      // 点击确认设置之后
      log() {
        this.regionId = [];
        this.regionName = '';
        for (var j = 0; j < this.gridData.length; j++) {
          for (var i = 0; i < this.gridData[j].regionBeanList.length; i++) {
            if (this.gridData[j].regionBeanList[i].check == true && this.gridData[j].regionBeanList[i].disabled == false) {
              this.regionName += this.gridData[j].regionBeanList[i].regionName + ',';
              //console.log(this.gridData[j].regionBeanList[i]);
              this.regionId.push(this.gridData[j].regionBeanList[i].regionId);
              console.log(this.regionId,8989);
            }
          }
        }
        if (this.regionName == '') {
          this.$message({
            message: '请选择省市',
            type: 'warning'
          })
        } else {
          this.dialogTableVisible = false;
        }
      },
      // 上移下移方法
      swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        // arr.storeSort = index1
        return arr
      },
      //上移
      upOne(arr, index) {
        if (arr.length > 1 && index !== 0) {
          this.tableData = this.swapItems(arr, index, index - 1)
        }
      },
      // 下移
      downOne(arr, index) {
        if (arr.length > 1 && index !== (arr.length - 1)) {
          this.tableData = this.swapItems(arr, index, index + 1)
        }
      },
      // 继续添加
      goonAdd() {
        this.centerDialogVisible = false;
        this.addData.areaName = '';
        this.regionName = '';
        this.tableData = [];
        this.addData.areaId = '';
        this.addData.areaName = '';
        this.addData.regionIds = '';
        this.addData.wmDSstoragesJson = [];

        for (var item1 of this.gridData) {
          if (item1.indeterminate == true) {
            item1.indeterminate = false
          }
          for (var item2 of item1.regionBeanList) {
              if (item2.check == true) {
                item2.check = false
              }
          }
        }
        // 如果继续添加，则把刚才的添加的城市置为不可选
        for (var item of this.regionId) {
          this.id.push(item)
        }
        for (var item of this.gridData) {
          for (var item1 of item.regionBeanList) {
            for (var item2 of this.id) {
              if (item1.regionId == item2) {
                item1.disabled = true
                break;
              }
            }
          }
        }
      },
      dialogTable() {
        this.dialogTableVisible = true;
      },
      // 点击添加仓库
      addButton() {
        // 选择仓库完整后再添加下一个
        if(this.tableData.length>=1){
          if(this.tableData[this.tableData.length-1].storageId == '') {
            return false;
          }
        }
        this.tableData.push({
          storageId: ''
        })
      },
      // 点击删除
      deleteStore(index) {
        this.tableData.splice(index, 1)
      },
     /* handleSelection(val) {
        console.log(val);
      },
      handleSelectionChange(row, index) {
        console.log(row, index)
      }*/
    },
    created() {
      // 动态获取表格高度
      this.$nextTick(function () {
        var a = document.body.clientHeight; // 页面高度
        var b = document.getElementById('fitTable').offsetTop; // 表格距离顶部的距离
        this.table_h = a - b - 290;
        // console.log(this.table_h)
      });
      // 获取所有大区地址
      this.query = () => {
        let self = this;
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/getDtAreaRegion')
          .then(function (res) {
            if (res.data.code == 0) {
              self.temp = res.data.result;
              for (var i = 0; i < self.temp.length; i++) {
                self.temp[i].areaId = false;
                self.temp[i].indeterminate = false;
                self.temp[i].disabled = false;
                for (var item of self.temp[i].regionBeanList) {
                  item.disabled = false
                }
              }
              for (var item of self.temp) {
                  for (var item1 of item.regionBeanList) {
                    for (var item2 of self.id) {
                      if (item1.regionId == item2) {
                        item.disabled = true;
                        item1.disabled = true;
                        item1.check = true;
                        item.indeterminate = true;
                        break;
                      }
                    }
                  }
              }
              self.gridData = self.temp;
              // console.log(self.gridData);
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
      this.query()
      let self = this;
      // 获取所有仓库
      self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/list')
        .then(function(res) {
          if (res.data.code == 0) {
            self.options = res.data.result;
          } else {
            self.$message({
              message: res.data.msg, // 如果code为其他，弹出错误码
              type: 'warning'
            })
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    }
  }
</script>
<style scoped>
	.boxt {
		width: 100%;
		text-align: center;
	}
	.box {
		margin: 20px 0 20px 30px;
	}
	.box1 span {
		margin-right: 20px;
    line-height: 20px;
	}
	.box2 {
		width: 100%;
		text-align: center;
	}
	.box8 {
		display: inline-block;
	}
  #tabBox{
    position: relative;
  }
  #tabBox .alertBox{
    position: absolute;
    top: -6px;
    left: 51px;
    z-index: 10;
  }
</style>
