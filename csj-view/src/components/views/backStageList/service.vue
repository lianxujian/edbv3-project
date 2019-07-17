<template>
  <div style='padding-left:20px;height:100%;'>
  	<div class="input-box">
  		<el-row style="">
  		  <el-col :span="6">
			<div><label for="">标题：</label><el-input size='small' v-model="paramData.qaTitle" @keyup.enter.native="queryBtn"></el-input></div>
		  </el-col>
		  <el-col :span="6">
			<div><label for="">联系人电话：</label><el-input size='small' v-model="paramData.contactPhone" @keyup.enter.native="queryBtn"></el-input></div>
		  </el-col>
		  <el-col :span="6">
			<div><label for="">联系人QQ：</label><el-input size='small' v-model="paramData.contactQq" @keyup.enter.native="queryBtn"></el-input></div>
		  </el-col>
		  <el-col :span="4">
			<el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
		  </el-col>
		</el-row>
  	</div>
  	<div class="release-nav">
  		<ul>
  			<li @click='delBtn'>删除</li>
  		</ul>
  	</div>
	<div class="border">
		<el-table
	  	id='fitTable'
    	:height='table_h'
		:data="tableData"
		border
		@selection-change="handleSelectionChange"
	    >
		    <el-table-column
		      align='center'
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      label="操作"
		      align='center'
		      width="110">
		      <template slot-scope="scope">
		        <el-button
		          type="text"
		          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
		        <el-button
		          type="text"
		          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="serviceIssueId"
		      align='center'
		      :show-overflow-tooltip='true'
		      label="服务编号"
		      min-width="">
		    </el-table-column>
		    <el-table-column
		      prop="qaTitle"
		      align='center'
		      min-width=''
		      label="标题">
		    </el-table-column>
		    <el-table-column
		      prop="qaDesc"
		      label="问题描述"
		      :show-overflow-tooltip='true'
		      min-width=''
		      align='center'
		      width="">
		    </el-table-column>
		    <el-table-column
		      prop="contactPhone"
		      align='center'
		      label="联系人电话"
		      min-width=''
		      width="">
		    </el-table-column>
		    <el-table-column
		      prop="contactQq"
		      align='center'
		      label="联系人QQ"
		      width="">
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
        <div class="dialog-box" style='width:500px;height:420px;margin-top:-210px;margin-left:-250px;'>
          <div class="dialog-head">
          修改服务通道<span @click='closeBtn'>&times;</span>
          </div>
          <div class="dialog-content">
            <div style='margin-top:20px;'></div>
            <div class='template-div'>
              <span>标题：</span>
              <el-input v-model="formData.qaTitle" style="width:300px;"></el-input>
            </div>
            <div class='template-div'>
              <span>联系电话：</span>
              <el-input v-model="formData.contactPhone" style="width:300px;"></el-input>
            </div>
            <div class='template-div'>
              <span>联系人QQ：</span>
              <el-input v-model="formData.contactQq" style="width:300px;"></el-input>
            </div>
            <div class='template-div'>
              <span>问题描述：</span>
              <el-input v-model="formData.qaDesc" style="width:300px;"></el-input>
            </div>
            <div class='template-div'>
              <el-button type='primary' size='small' style='margin:10px 30px 0px 110px;' @click='editorSave'>保存</el-button>
              <el-button size='small' style='margin:10px;' @click='closeBtn'>取消</el-button>
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
    	renderFn:()=>{},
    	table_h:0,
        totalNum:0,
        totalPage:20,
        currentPage:1,
    	tableData:[],
    	paramData:{
    		qaTitle:"",
    		contactPhone:'',
    		contactQq:'',
    		page:1,
    		rows:20
    	},
    	formData:{

    	},
    	dialogShow:false,
    	selectionData:[]
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
  	//多选框
  	handleSelectionChange(val){
  		this.selectionData=val;
  	},
  	//编辑
  	handleEdit(index,row){
  		this.dialogShow=true;
  		this.formData.serviceIssueId=row.serviceIssueId;
  		this.formData.qaTitle=row.qaTitle;
  		this.formData.contactPhone=row.contactPhone;
  		this.formData.contactQq=row.contactQq;
  		this.formData.qaDesc=row.qaDesc;
  	},
  	//删除单条
  	handleDelete(index,row){
  		this.$confirm('确认要删除本条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
         	var self = this;
	        this.$axios({
	        	method:'get',
	        	url:process.env.OLD_API + 'api/serviceChannel/delOneChannel?serviceIssueId='+row.serviceIssueId
	        })
	          .then(function (response) {
	            //console.log(response)
		    	if(response.data.code==0){
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
        }).catch(() => {});
  	},
  	//删除多条
  	delBtn(){
  		if(this.selectionData.length==0){
	        this.$message({
              message: '请选择要删除的数据！',
              type: 'warning'
            });
	    }else{
	    	var serviceIssueIds='';
	    	this.selectionData.forEach((item,i)=>{
	    		serviceIssueIds+=item.serviceIssueId+',';
	    	})
	    	this.$confirm('确认要删除这些数据吗？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning',
	          center: true
	        }).then(() => {
	         	var self = this;
	        this.$axios({
	        	method:'get',
	        	url:process.env.OLD_API + 'api/serviceChannel/delBatchChannel?serviceIssueIds='+serviceIssueIds.slice(0,-1)
	        })
	          .then(function (response) {
	            //console.log(response)
		    	if(response.data.code==0){
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
	        }).catch(() => {});
	    }
  	},
  	closeBtn(){
  		this.dialogShow=false;
  	},
  	queryBtn(){
  		this.renderFn();
  	},
  	editorSave(){
  		var self = this;
	        this.$axios({
	        	method:'post',
	        	url:process.env.OLD_API + 'api/serviceChannel/updateChannel',
	        	data:this.formData,
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
	            	self.dialogShow=false;
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
        	url:process.env.OLD_API + 'api/serviceChannel/searchChannelByOptions',
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
	.input-box label{
		width:90px;
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
		width:80px;
		text-align:right;
	}
</style>
