<template>
  <div style='padding-left:20px;height:100%;'>
  	<div class="input-box">
  		<el-row style="">
  		  <el-col :span="5">
			<div>
				<label for="" style="margin-right:1px;">时间：</label>
				<el-select size='small' v-model="paramData.type" @change="queryBtn">
				    <el-option
				      v-for="item in timeStatus"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</div>
		  </el-col>
		  <el-col :span="5">
			<div style="white-space:nowrap;">
				<label for="" style='margin-right:2px;'>从：</label>
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
			<div><label for="">操作员：</label><el-input size='small' v-model="paramData.creater" @keyup.enter.native="queryBtn"></el-input></div>
		  </el-col>
		  <el-col :span="4">
			<el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
		  </el-col>
		</el-row>
  	</div>
  	<div class="release-nav">
  		<ul>
  			<li @click='exportBtn'>导出</li>
        <li style="border-right:none;float:right;">合计：{{getOrPub}}宝贝数 <span>{{commodity.commodityNum}}</span>，消费金额 <span>{{commodity.consumeNum}}</span></li>
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
		      prop="createTime"
		      align='left'
		      :show-overflow-tooltip='true'
		      label="时间"
		      min-width="">
		    </el-table-column>
		    <el-table-column
		      prop="goodsNum"
		      align='center'
		      min-width='130'
		      :label="getBaby">
		    </el-table-column>
		    <el-table-column
		      prop="unitPrice"
		      :label="getPrice"
		      :show-overflow-tooltip='true'
		      min-width=''
		      align='right'
		      width="">
		    </el-table-column>
		    <el-table-column
		      prop="consumeAmount"
		      align='right'
		      label="消费金额（元）"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
    	queryFn:()=>{},
      commodityFn:()=>{},
    	table_h:0,
    	pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        totalNum:0,
        totalPage:20,
        currentPage:1,
    	tableData:[],
    	getBaby:'获取宝贝数',
    	getPrice:'获取单价（元/条）',
    	timeStatus:[
    		{
    			label:'获取时间',
    			value:'B21'
    		},
    		{
    			label:'发布时间',
    			value:'B22'
    		}
    	],
    	paramData:{
    		page:1,
    		rows:20,
    		type:'B21',
    		creater:'',
    		startTime:'',
    		endTime:''
    	},
      commodity:{
        commodityNum:'0',
        consumeNum:'0.00'
      },
      opType:'B21',
      getOrPub:'获取'
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
  	//补零的方法
      returnFloat(x) {
        var f = parseFloat(x);
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      queryBtn(){
        this.opType=this.paramData.type=='B21'?'B21':'B22';
        this.getOrPub=this.paramData.type=='B21'?'获取':'发布';
      	this.queryFn();
        this.commodityFn();
      },
  	exportBtn(){
  		if(this.paramData.type=='B21'){
  			location.href=process.env.OLD_API+'/api/consumeLog/getGainExcel?type='+this.paramData.type+'&creater='+this.paramData.creater+'&startTime='+this.paramData.startTime+'&endTime='+this.paramData.endTime;
  		}else{
  			location.href=process.env.OLD_API+'/api/consumeLog/getPubExcel?type='+this.paramData.type+'&creater='+this.paramData.creater+'&startTime='+this.paramData.startTime+'&endTime='+this.paramData.endTime;
  		}

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
        	url:process.env.OLD_API + 'api/consumeLog/getConsumerList',
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
            	self.totalNum=response.data.result.total;
	            self.tableData=response.data.result.rows?response.data.result.rows:[];
	            self.tableData.forEach((item,index)=>{
	            	item.unitPrice=self.returnFloat(item.unitPrice);
	            	item.consumeAmount=self.returnFloat(item.consumeAmount);
	            })
	            if(self.paramData.type=='B21'){
	            	self.getBaby='获取宝贝数';
	            	self.getPrice='获取单价（元）';
	            }else{
	            	self.getBaby='发布宝贝数';
	            	self.getPrice='发布单价（元）';
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
  	}
  	this.queryFn();
  	this.commodityFn=()=>{
      this.$axios({
        method:'post',
        url:process.env.OLD_API + 'api/consumeLog/getStatistics',
        data:{
          opType:self.opType
        },
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
            self.commodity.commodityNum = response.data.result?response.data.result.commodityNum:'0';
            self.commodity.consumeNum = response.data.result?response.data.result.consumeNum:'0.00';
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
    this.commodityFn();
  },
  created(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.input-box label{
		width:60px;
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
</style>
