<template>
  <div style='padding-left:20px;height:100%;'>
  	<div class="input-box">
  		<el-row style="">
  		  <el-col :span="5">
  				<div><label for="">账号：</label><el-input size='small' v-model="paramData.mainAccount" @keyup.enter.native="queryBtn"></el-input></div>
  			  </el-col>
  			  <el-col :span="5">
  				<div><label for="">公司名称：</label><el-input size='small' v-model="paramData.merchantName" @keyup.enter.native="queryBtn"></el-input></div>
  			  </el-col>
  			  <el-col :span="5">
				<div>
					<label for="" style="margin-right:1px;">启用状态：</label>
					<el-select size='small' v-model="paramData.status" placeholder="请选择">
					    <el-option
					      v-for="item in enableStatus"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</div>
			  </el-col>
        <el-col :span="5">
          <div>
            <label for="" style="margin-right:1px;">试用状态：</label>
            <el-select size='small' v-model="paramData.tryOutStatus" placeholder="请选择">
              <el-option
                v-for="item in ontrialStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
			  <el-col :span="4">
				<el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
			  </el-col>
  			</el-row>
      <el-row style="margin-top:10px;">
        <el-col :span="5">
          <div>
            <label for="" style="margin-right:4px;">是否充值：</label>
            <el-select size='small' v-model="paramData.rechargeStatus" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
  	</div>
  	<div class="release-nav">
  		<ul>
  			<li @click='addBtn'>新增</li>
  		</ul>
  	</div>
	<div class="border">
		<el-table
	  	id='fitTable'
    	:height='table_h'
		:data="tableData"
		border
	    >
		    <el-table-column
		      prop="mainAccount"
		      align='center'
		      label="账号"
		      min-width="">
		    </el-table-column>
		    <el-table-column
		      prop="merPassword"
		      align='center'
		      min-width=''
		      label="密码">
		    </el-table-column>
		    <el-table-column
		      prop="merchantName"
		      label="公司名称"
		      min-width=''
		      align='center'
		      width="">
		    </el-table-column>
      <el-table-column
        prop="createTimeForShow"
        label="创建日期"
        min-width=''
        align='center'
        width="">
      </el-table-column>
      <el-table-column
        prop="expireTimeForShow"
        label="试用到期日期"
        min-width=''
        align='center'
        width="">
      </el-table-column>
      <el-table-column
        prop="rechargeStatus"
        label="是否充值"
        min-width=''
        align='center'
        width="">
      </el-table-column>
      <el-table-column
        label="试用状态"
        align='center'
        prop="tryOutStatus"
        width="110">
      </el-table-column>
		    <el-table-column
		      label="启用状态"
		      align='center'
		      width="110">
		      <template slot-scope="scope">
		        <span v-if='scope.row.status=="B01"' type="text" style="color:#94E727;">已启用</span>
		        <span v-else type="text" style='color:#DE3A45;'>已停用</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作"
		      align='center'
		      width="110">
		      <template slot-scope="scope">
		        <el-button v-if='scope.row.status=="B01"' type="text" @click="enable(scope.$index, scope.row)">停用</el-button>
		        <el-button v-else type="text" @click="enable(scope.$index, scope.row)">启用</el-button>
            <el-button type="text" @click="editBtn(scope.$index, scope.row)">编辑</el-button>
		      </template>
		    </el-table-column>
	  </el-table>
	</div>
	<div style='float:right;margin-top:5px;'>
		<el-pagination
		  style='float:left;'
		  @size-change="handleSizeChange"
		  @current-change="handleCurrentChange"
		  :current-page="currentPage"
		  :page-sizes="[10, 20, 30, 50]"
		  :page-size="totalPage"
		  layout="total, sizes, prev, pager, next, jumper"
		  :total="totalNum">
		</el-pagination>
		<i class='el-icon-refresh' @click='refresh'></i>
	</div>
	<div class="dialog" v-if="dialogShow">
        <div class="mask"></div>
        <div class="dialog-box" style='width:500px;height:480px;margin-top:-240px;margin-left:-250px;'>
          <div class="dialog-head">
          添加账号<span @click='closeBtn'>&times;</span>
          </div>
          <div class="dialog-content">
            <div style='margin-top:20px;'></div>
            <div class='template-div'>
              <span>账号类型：</span>
              <el-select v-model="accountPrefix" placeholder="请选择" @change="accountPrefixChange">
                <el-option
                  v-for="item in accountPrefixArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class='template-div'>
              <span>账号：</span>
              <el-input :disabled="isdisabled" v-model="merchantLoginName" style="width:300px;"></el-input>
             <!-- <div style="font-size:12px;color:orange;margin:10px 0 0 34px;">（当账号类型选择edb_a时，账号必须输入以edb_a开头后面跟6位数的字符。）</div>-->
            </div>
            <div class='template-div'>
              <span>密码：</span>
              <el-input v-model="addFormData.merchantLoginPassword" style="width:300px;"></el-input>
            </div>
            <div class='template-div'>
              <span>公司名称：</span>
              <el-input v-model="addFormData.merchantName" style="width:300px;"></el-input>
            </div>
            <div class='template-div'>
              <span style='margin-right:30px;'>状态：</span>
               <el-radio-group v-model="addFormData.status">
			    <el-radio label="B01">启用</el-radio>
			    <el-radio label="B02">停用</el-radio>
			  </el-radio-group>
            </div>
            <div class='template-div'>
              <el-button type='primary' size='small' style='margin:10px 60px 0px 80px;' @click='addBtnSave(0)'>保存</el-button>
              <el-button size='small' style='margin:10px;' @click='addBtnSave(1)'>确定并继续</el-button>
            </div>
          </div>
        </div>
      </div>
  <div class="dialog" v-if="dialogEditShow">
      <div class="mask"></div>
      <div class="dialog-box" style='width:500px;height:430px;margin-top:-215px;margin-left:-250px;'>
        <div class="dialog-head">
          修改账号<span @click='closeBtn'>&times;</span>
        </div>
        <div class="dialog-content">
          <div style='margin-top:20px;'></div>
          <div class='template-div'>
            <span>账号：</span>
            <el-input v-model="editFormData.mainAccount" style="width:300px;"></el-input>
          </div>
          <div class='template-div'>
            <span>密码：</span>
            <el-input v-model="editFormData.merPassword" style="width:300px;"></el-input>
          </div>
          <div class='template-div'>
            <span>公司名称：</span>
            <el-input v-model="editFormData.merchantName" style="width:300px;"></el-input>
          </div>
          <div class='template-div'>
            <label for="">试用到期时间：</label>
            <el-date-picker
              :clearable="false"
              :disabled="isEditDate"
              v-model="editFormData.expireTime"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              format='yyyy-MM-dd'
              value-format='yyyy-MM-dd'>
            </el-date-picker>
          </div>
          <div class='template-div'>
            <el-button type='primary' size='small' style='margin:20px 20px 0 135px;' @click='editBtnSave'>保存</el-button>
            <el-button @click="dialogEditShow = false" size="small">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
    	renderFn:()=>{},
        totalNum:0,
        totalPage:20,
        currentPage:1,
    	tableData:[],
    	table_h:0,
    	enableStatus:[
    		{
    			label:'全部',
    			value:'A03'
    		},
    		{
    			label:'启用',
    			value:'B01'
    		},
    		{
    			label:'停用',
    			value:'B02'
    		}
    	],
      ontrialStatus:[
        {
          label:'全部',
          value:'ALL'
        },
        {
          label:'试用中',
          value:'A00'
        },
        {
          label:'已到期',
          value:'A01'
        }
      ],
    	paramData:{
    		mainAccount:"",
    		merchantName:'',
        rechargeStatus:'',
    		status:'A03',
        tryOutStatus:'ALL',
    		page:1,
    		rows:20
    	},
    	addFormData:{
    		merchantLoginName:'',
    		merchantLoginPassword:'',
    		merchantName:'',
    		status:'B01'
    	},
      editFormData:{
        mainAccount:'',
        merchantName:'',
        merPassword:'',
        expireTime:''
      },
      merchantLoginName:'',
    	dialogShow:false,
      dialogEditShow:false,
    	selectionData:[],
      accountPrefix:'',
      accountPrefixArr:[
        {
          label:'csj_a',
          value:1
        },
        {
          label:'edb_a',
          value:2
        }
      ],
      isdisabled:false,
      isEditDate:false
    }
  },methods:{
  	handleSizeChange(val){
  		this.paramData.rows=val;
  		this.renderFn();
  	},
  	handleCurrentChange(val){
  		this.paramData.page=val;
  		this.renderFn();
  	},
  	refresh(){
  		this.renderFn();
  	},
  	addBtn(){
  		this.dialogShow=true;
      this.accountPrefix='';
      this.merchantLoginName='';
  		this.addFormData={
    		status:'B01'
    	};
  	},
  	enable(index,row){
  		var status=row.status=='B01'?'B02':'B01';
  		var self = this;
	        this.$axios({
	        	method:'get',
	        	url:process.env.OLD_API + 'api/meraccount/updateStatus?merchantId='+row.merchantId+'&status='+row.status
	        })
	          .then(function (response) {
		        if(response.data.code==0){
	            	row.status=status;
	            }else{
	            	self.$message({
                      	  message: response.data.message,
                          type: 'warning'
                        });
	            }
	          })
	          .catch(function (error) {
	            console.log(error);
	          });
  	},
  	//新增保存
  	addBtnSave(m){
      this.addFormData.merchantLoginName=this.merchantLoginName;
  		if(this.accountPrefix==''||this.accountPrefix==undefined){
  			this.$message({
          	  message: '请选择账号类型',
              type: 'warning'
            });
            return false
  		}
  		if(this.accountPrefix == 2 && !(/^edb_a/.test(this.addFormData.merchantLoginName))){
        this.$message({
          message: '当账号类型选择edb_a时，账号必须输入以edb_a开头的字符',
          type: 'warning'
        });
        return false;
      }
  		if(this.addFormData.merchantLoginPassword==''||this.addFormData.merchantLoginPassword==undefined){
  			this.$message({
          	  message: '请输入密码',
              type: 'warning'
            });
            return false;
  		}
  		if(this.addFormData.merchantName==''||this.addFormData.merchantName==undefined){
  			this.$message({
          	  message: '请输入公司名称',
              type: 'warning'
            });
            return false;
  		}
	    var self = this;
	        this.$axios({
	        	method:'post',
	        	url:process.env.OLD_API + 'api/meraccount/addMerAccount',
	        	data:this.addFormData,
	        	transformRequest:[function (data) {
		          let newData = '';
		          for(let k in data){
		            newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
		          }
		          return newData;
		        }]
	        })
	          .then(function (response) {
	            //console.log(response)
		    	if(response.data.code==0){
	            	self.renderFn();
	            	if(m==0){
	            		self.dialogShow=false;
	            	}else{
	            		self.addFormData={
				    		status:'B01'
				    	};
	            	}
	            }else{
	            	self.$message({
                  	  message: response.data.message,
                      type: 'warning'
                    });
	            }
	          })
	          .catch(function (error) {
	            console.log(error);
	          });
  	},
  	closeBtn(){
  		this.dialogShow=false;
      this.dialogEditShow=false;
  	},
  	queryBtn(){
  		this.renderFn();
  	},
    accountPrefixChange(){
      if(this.accountPrefix == 1){
        this.isdisabled=true;
        var self = this;
        this.$axios({
          method:'get',
          url:process.env.OLD_API + 'api/meraccount/nameAuto?type='+self.accountPrefix
        })
          .then(function (response) {
            if(response.data.code==0){
              self.merchantLoginName='csj_a'+response.data.result;
            }else{
              self.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }else{
        this.isdisabled=false;
        this.merchantLoginName='';
      }
    },
    editBtn(index,row){
      if(row.rechargeStatus=='是'){
        this.isEditDate=true;
      }else{
        this.isEditDate=false;
      }
      this.editFormData.merchantId=row.merchantId;
      this.editFormData.mainAccount=row.mainAccount;
      this.editFormData.merchantName=row.merchantName;
      this.editFormData.merPassword=row.merPassword;
      this.editFormData.expireTime=row.expireTimeForShow;
      this.dialogEditShow=true;
    },
    editBtnSave(){
      if(this.editFormData.mainAccount.trim()==''){
        this.$message({
          message: '账号不能为空',
          type: 'warning'
        });
        return false;
      }
      if(this.editFormData.merPassword.trim()==''){
        this.$message({
          message: '密码不能为空',
          type: 'warning'
        });
        return false;
      }
      if(this.editFormData.merchantName.trim()==''){
        this.$message({
          message: '公司名称不能为空',
          type: 'warning'
        });
        return false;
      }
      var self=this;
      self.$axios({
        method:'post',
        url:process.env.OLD_API + 'api/meraccount/updateMerchantInfo',
        data:self.editFormData,
        transformRequest:[function (data) {
          let newData = '';
          for(let k in data){
            newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
          }
          return newData;
        }]
      })
        .then(function (response) {
          if(response.data.code==0){
            self.dialogEditShow=false;
            self.renderFn();
          }else{
            self.$message({
              message: response.data.message,
              type: 'warning'
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    renderTableHeight() {
      this.$nextTick(function () {
        this.table_h=$(window).height()-$('#fitTable').offset().top-45;
      });
      window.onresize = () => {
        this.table_h=$(window).height()-$('#fitTable').offset().top-45;
      }
    },
  },
  mounted(){
  	//渲染表格高度
  	this.renderTableHeight();
  	var self=this;
  	this.renderFn=()=>{
  		self.$axios({
        	method:'post',
        	url:process.env.OLD_API + 'api/meraccount/getByPage',
        	data:self.paramData,
        	transformRequest:[function (data) {
	          let newData = '';
	          for(let k in data){
	            newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
	          }
	          return newData;
	        }]

        })
          .then(function (response) {
	        if(response.data.code==0){
            	self.tableData=response.data.result.rows;
            	self.totalNum=response.data.result.total;
            }else{
            	self.$message({
                  	  message: response.data.message,
                      type: 'warning'
                    });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
  	}
  	this.renderFn();
  },
  created(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.input-box{
		display:inline-block;
	}
	.input-box label{
		width:80px;
		display:inline-block;
		text-align:right;
		margin-right:5px;
	}
	.el-select{
		width:60%;
	}
	.el-input{
		width:60% !important;
	}
	.release-nav{
		background:#2EA3FC;
		width:100%;
		height:38px;
		margin:15px 0;
		display:inline-block;
	}
	.release-nav ul li{
		float:left;
		height:26px;
		margin-top:6px;
		line-height:26px;
		padding:0 40px;
		color:#fff;
		border-right:1px solid #fff;
		cursor: pointer;
	}
	.template-div{
		margin-bottom:20px;
	}
	.template-div span{
		display:inline-block;
		width:97px;
		text-align:right;
	}
</style>
