<template>
  <div style='padding-left:20px;height:100%;'>
  	<div class="input-box">
  		<el-row style="">
		  <el-col :span="5">
			<div style="white-space:nowrap;">
				<label for="" style='margin-right:2px;text-align:center;'>充值时间：</label>
			    <el-date-picker
                    :editable='false'
                    size='small'
                    @change="channelChangeDate(1)"
                    v-model="paramData.startTime"
                    type="datetime"
                    format='yyyy-MM-dd HH:mm:ss'
                    value-format='yyyy-MM-dd HH:mm:ss'
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions">
                  </el-date-picker>
			</div>
		  </el-col>
		  <el-col :span="5">
			<div style="white-space:nowrap;">
				<label for="" style="margin-right:2px;">至：</label>
				<el-date-picker
                    :editable='false'
                    size='small'
                    @change="channelChangeDate(2)"
                    v-model="paramData.endTime"
                    type="datetime"
                    format='yyyy-MM-dd HH:mm:ss'
                    value-format='yyyy-MM-dd HH:mm:ss'
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions">
                  </el-date-picker>
			</div>
		  </el-col>
		  <el-col :span="5">
			<div>
				<label for="" style="margin-right:1px;">充值方式：</label>
				<el-select size='small' v-model="paramData.type">
				    <el-option
				      v-for="item in rechargeWay"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</div>
		  </el-col>
		  <el-col :span="5">
			<div><label for="">操作员：</label><el-input size='small' v-model="paramData.creater" @keyup.enter.native="queryBtn"></el-input></div>
		  </el-col>
		  <el-col :span="4">
			<el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
		  </el-col>
		</el-row>
  	</div>
  	<div class="release-nav">
  		<ul>
  			<li @click='rechargeBtn'>充值</li>
  			<li @click='exportBtn'>导出</li>
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
		      align='center'
		      prop='number'
		      label="序号"
		      width="80">
		    </el-table-column>
		    <el-table-column
		      prop="timeStr"
		      align='left'
		      :show-overflow-tooltip='true'
		      label="充值时间"
		      min-width="">
		    </el-table-column>
		    <el-table-column
		      prop="typeStr"
		      align='center'
		      min-width='130'
		      label="充值方式">
		    </el-table-column>
		    <el-table-column
		      prop="mainAccount"
		      label="充值账号"
		      :show-overflow-tooltip='true'
		      min-width=''
		      align='center'
		      width="">
		    </el-table-column>
		    <el-table-column
		      prop="rechargeAmount"
		      align='right'
		      label="充值金额（元）"
		      min-width=''
		      width="">
		    </el-table-column>
		    <el-table-column
		      prop="rechargeStatusStr"
		      align='center'
		      label="充值状态"
		      min-width=''
		      width="">
		    </el-table-column>
		    <el-table-column
		      prop="creater"
		      align='center'
		      label="操作员"
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
	 <el-dialog
      title="充值"
      :close-on-click-modal="false"
      :visible.sync="centerDialogVisible"
      width="420px"
    >
      <div>
        <ul class="t-ul">
          <li><span>充值账号：{{rechargeData.mainAccount}}</span></li>
          <li><span style="">充值金额：</span>
            <el-select v-model="rechargeParam" placeholder="请选择充值金额">
              <el-option
                v-for="item in rechargeData.rechargeGoodsBeanList"
                :key="item.rechargeGoodsId"
                :label="item.rechargeGoodsName"
                :value="item.rechargeGoodsId">
              </el-option>
            </el-select>
          </li>
          <li>
            <span style="vertical-align: top;">充值方式：</span>
            <span class='pay-way' v-for='(item,index) in payData' :class="{'pay-active':subIndex==index}" @click="submenutab(index)">{{item}}</span>
          </li>
          <li>
            <el-button style='width:295px;' type='primary' @click='nextBtn'>下一步</el-button>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { returnFloat } from '@/assets/js/validate';
export default {
  data () {
    return {
    	queryFn:()=>{},
    	pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        table_h:0,
        centerDialogVisible: false,
        rechargeParam: '',//
        rechargeData:'',
        payData:['支付宝'],
        subIndex:0,
        totalNum:0,
        totalPage:20,
        currentPage:1,
    	tableData:[],
    	rechargeWay:[
    		{
    			label:'全部',
    			value:'typeAll'
    		},
    		{
    			label:'支付宝',
    			value:'B41'
    		}
    	],
    	paramData:{
    		mainAccount:'',
    		page:1,
    		rows:20,
    		type:'typeAll',
    		creater:'',
    		startTime:'',
    		endTime:''
    	}
    }
  },methods:{
    channelChangeDate(item){
      if(this.paramData.startTime && this.paramData.endTime && new Date(this.paramData.startTime).getTime() > new Date(this.paramData.endTime).getTime()){
        this.$message({
          message: '起始时间不能大于结束时间！',
          type: 'warning'
        });
        if(item == 1){
          this.paramData.startTime = '';
        }else{
          this.paramData.endTime = '';
        }
      }
    },
  	exportBtn(){
  		location.href=process.env.OLD_API+'/api/record/customerExcel?creater='+this.paramData.creater+'&type='+this.paramData.type+'&startTime='+this.paramData.startTime+'&endTime='+this.paramData.endTime;
  	},
  	queryBtn(){
  		this.queryFn();
  	},
  	handleSizeChange(val){
		this.paramData.rows=val;
  		this.queryFn();
  	},
  	handleCurrentChange(val){
		this.paramData.page=val;
  		this.queryFn();
  	},
  	refresh(){
  		this.queryFn();
  	},
  	//显示弹出框
	  rechargeBtn(){
	    this.centerDialogVisible=true;
	    this.rechargeParam='';
	    var self = this;
	      this.$axios({
	        method:'post',
	        url:process.env.OLD_API + 'api/recharge/params'
	      })
	      .then(function (response) {
	        console.log(response)
	        if(response.data.code==0){
	          self.rechargeData=response.data.result;
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
	  //支付方式切换
	  submenutab(val){
	    this.subIndex=val;
	  },
	  //下一步
	  nextBtn(){

	    //return false;
	    if(this.rechargeParam==''){
	      this.$message({
	        message: '请选择充值金额',
	        type: 'warning'
	      });
	    }else{
	      var self = this;
	      var paramData={
	        payWay:'B41',
	        rechargeGoodsId:this.rechargeParam
	      }
	      self.centerDialogVisible=false;
	      window.open('#/payPage/B41/'+self.rechargeParam);
	      return false;
	    }
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
  	var self = this;
  	this.queryFn=()=>{
        this.$axios({
        	method:'post',
        	url:process.env.OLD_API + 'api/record/getRechargeList',
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
            console.log(response)
            if(response.data.code==0){
            	self.totalNum=response.data.result.returnData.total;
	            self.tableData=response.data.result.returnData.rows;
	            self.tableData.forEach((item,i)=>{
	            	item.rechargeAmount=returnFloat(item.rechargeAmount/100);
	            })
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
  	this.queryFn();
  },
  created(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.t-ul{
    margin-bottom:30px;
  }
  .t-ul li {
    margin-left: 12%;
    height: 80px;
  }
	.input-box label{
		width:72px;
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
	/*.pay-way{
    display: inline-block;
    border: 1px solid #ccc;
    padding: 2px 16px;
    border-radius: 6px;
    margin-right: 20px;
    cursor: pointer;
  }
  .pay-active{
    color:#fff;
    background: orange;
  }*/
</style>

