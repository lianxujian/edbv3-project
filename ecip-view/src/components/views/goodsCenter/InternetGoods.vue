<!--平台商品查询 佩玖-->
<template>
  <div id="internetGoods">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox2"><!--查询区-->
        <el-row>
          <el-col :span="9">
            <div class="grid-content spicese" style="white-space: nowrap">
              <!--<span>时间类型：</span>-->
              <el-select style="width:25%!important;" class="spicese1" v-model="timeType" placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                style="width:60%;position: relative;top: -2px;"
                v-model="applyTime"
                type="datetimerange"
                range-separator="-"
                format="yyyy/MM/dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content" style="white-space: nowrap">
              <span>平台类型：</span>
              <el-select  v-model="receiveType" clearable placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content" style="white-space: nowrap">
              <span>店铺nick：</span>
              <el-select v-model="receiveType" clearable placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="9">
            <div class="grid-content spicese" style="white-space: nowrap">
              <!--<span>时间类型：</span>-->
              <el-select style="width:25%!important;" class="spicese1" v-model="receiveType" clearable placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width:60%!important;" @keyup.native.enter="query()"
                        v-model="serachData">
              </el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content" style="white-space: nowrap">
              <span>商品状态：</span>
              <el-select  v-model="receiveType" clearable placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>


        </el-row>

        <el-row v-if="isShow">
          <el-col :span="9">
            <div class="grid-content spicese" style="white-space: nowrap">
              <!--<span>时间类型：</span>-->
              <el-select style="width:25%!important;" class="spicese1" v-model="receiveType" clearable placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width:60%!important;" @keyup.native.enter="query()"
                        v-model="serachData">
              </el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content" style="white-space: nowrap">
              <span>商品状态：</span>
              <el-select  v-model="receiveType" clearable placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>


        </el-row>

      </div>

      <!--按钮-->
      <div class="rightBox2" style="width:300px!important;">
        <el-button type="primary" @click="query()" style="width:70px!important;">查 询</el-button>
        <el-button @click="reset()" style="width:70px!important;">重 置</el-button>
        <el-button @click="isShow = true" style="width:33%!important;" v-if="!isShow">高级查询
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>

        <el-button @click="isShow = false" style="width:33%!important;" v-else>高级查询
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <!--表格区-->
    <div>
      <el-table
        :data="tableData5"
        border
        ref="itoktab"
        id="fitTable5"
        :min-height="80"
        tooltip-effect="dark"
        style="width: 100%">

        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          align="center"
          label="店铺nick"
          prop="nick"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="spu_num_iid"
          align="center"
          min-width="100"
          label="宝贝ID">
        </el-table-column>

        <el-table-column
          prop="title"
          align="center"
          label="宝贝名称"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="price"
          align="center"
          label="宝贝价格"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="sku_num_iid"
          align="center"
          label="skuID"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="platform_cid"
          align="center"
          label="页子类目录ID"
          min-width="120">
        </el-table-column>

        <el-table-column
          align="center"
          label="图片"
          min-width="100">
          <template slot-scope="scope">
            <img :src="scope.row.pic_url"
                 style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
          </template>
        </el-table-column>

        <el-table-column
          prop="platform_list_time"
          align="center"
          label="上架时间"
          min-width="130">
        </el-table-column>

        <el-table-column
          prop="platform_delist_time"
          align="center"
          label="下架时间"
          min-width="130">
        </el-table-column>

        <el-table-column
          prop="modified"
          align="center"
          label="修改时间"
          min-width="130">
        </el-table-column>

        <el-table-column
        prop="approve_status"
        align="center"
        label="宝贝状态"
        min-width="130">
      </el-table-column>

        <el-table-column
          prop="sku_outer_id"
          align="center"
          label="商家编码"
          min-width="130">
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage5"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum5">
        </el-pagination>
      </div>
    </div>
    <!--新增弹框-->
    <div class="isspliec">
      <!--增加品牌-->
      <el-dialog v-dialogDrag
                 title="添加品牌"
                 :visible.sync="visibleLead"
                 width="500px"
                 :before-close="handleClose">
        <div>
          <ul class="leadUl" type="disc">
            <el-form label-width="90px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">

              <el-form-item label="分类编码" prop="category_code">
                <el-input type="text" placeholder="最多输入20个字符" v-model="addData.category_code" style="width: 100%"
                          :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="分类名称" prop="category_cn_name">
                <el-input type="text" placeholder="最多输入10个字符" v-model="addData.category_cn_name" style="width: 100%"
                          :maxlength="10"></el-input>
              </el-form-item>
              <el-form-item label="英文名称" prop="category_en_name">
                <el-input type="text" placeholder="" v-model="addData.category_en_name" style="width: 100%"
                          :maxlength="20"></el-input>
              </el-form-item>


              <el-form-item label="启用状态" prop="status">
                <el-select v-model="addData.status" filterable placeholder="请选择仓库" style="width: 100%!important;">
                  <el-option
                    v-for="item in optionsStock1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" placeholder="请输入备注" v-model="addData.remark" style="width: 100%"
                          :maxlength="200"></el-input>
              </el-form-item>
              <el-form-item style="width:100%;text-align: center">
                <el-button type="plain"  @click="handleClose()">取消</el-button>
                <el-button type="primary" @click="sure('addData')">确定</el-button>
              </el-form-item>
            </el-form>
          </ul>
        </div>
      </el-dialog>
      <!-- 编辑-->
      <el-dialog v-dialogDrag
                 title="编辑品牌"
                 :visible.sync="visibleLead2"
                 width="500px"
                 :before-close="handleClose2">
        <div>
          <ul class="leadUl" type="disc">
            <el-form label-width="90px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">

              <el-form-item label="分类编码" prop="remark">
                <el-input type="text" placeholder="请输入入库备注" v-model="addData.remark" style="width: 100%"
                          :maxlength="200"></el-input>
              </el-form-item>
              <el-form-item label="分类名称" prop="remark">
                <el-input type="text" placeholder="请输入入库备注" v-model="addData.remark" style="width: 100%"
                          :maxlength="200"></el-input>
              </el-form-item>
              <el-form-item label="英文名称" prop="remark">
                <el-input type="text" placeholder="请输入入库备注" v-model="addData.remark" style="width: 100%"
                          :maxlength="200"></el-input>
              </el-form-item>

              <el-form-item label="上级分类" prop="remark">
                <el-input type="text" placeholder="请输入入库备注" v-model="addData.remark" style="width: 100%"
                          :maxlength="200"></el-input>
              </el-form-item>



              <el-form-item label="启用状态" prop="storageId">
                <el-select v-model="addData.storageId" filterable placeholder="请选择仓库" style="width: 100%!important;">
                  <el-option
                    v-for="item in optionsStock1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" placeholder="请输入入库备注" v-model="addData.remark" style="width: 100%"
                          :maxlength="200"></el-input>
              </el-form-item>
              <el-form-item style="width:100%;text-align: center">
                <el-button type="plain"  @click="handleClose2()">取消</el-button>
                <el-button type="primary" @click="sure1('addData')">确定</el-button>
              </el-form-item>
            </el-form>
          </ul>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        serachData:'',
        applyTime:'',
        isShow:false,
        addData: { //根分类参数
          category_code:'',
          category_cn_name:'',
          category_en_name:'',
          status:'',
          remark:''
        },
        timeType:1,//默认1
        custom:[{label:'宝贝创建时间',value:1,},{label:'宝贝更新时间',value:2}],//时间类型
        optionsStock1:[{label:'启用',value:true},{label:'未启用',value:false}],//启用状态
        visibleLead: false, //增加根分类
        visibleLead2: false, //编辑
//        table_h5: 100,//高度
        totalNum5: 0, //总条数
        tableData5: [], //主数据
        pageSize5: 15, //当夜页条数
        curPage5: 1, //当前页
        rules: {
          category_code: [     //必选入库类型
            {trigger: 'change', required: true, message: '请选择入库类型！'}
          ],
          category_cn_name: [         //必选仓库
            {trigger: 'change', required: true, message: '请选择仓库！'},
          ],
          category_en_name: [         //必选仓库
            {trigger: 'change', required: true, message: '请选择仓库！'},
          ],

        },//校验表单规则

      }
    },


    methods: {
      //查询
      query() {
        this.initMessages5();

      },

      sure(){
        this.$refs.addData.validate((valid)=>{
          if(valid){
            let data={
              method: 'category.add',
              customerId: 'kejie',
              encrypted: false,
              app_key:1,
              sign:'AF8D64A693CB6976D2DAD73D8EB2CF23',
              session:1,
              format: 'json',
              category_code: this.addData.category_code,
              category_cn_name: this.addData.category_cn_name,
              remark:this.addData.remark,
              category_en_name: this.addData.category_en_name,
              parent_id:0,
              flag_del: 1,
              status:this.addData.status,
              sort_order: 1
            }
            this._post('/ecip.goods.center/execute',data).then(res=>{


            })



          }

        })

      },

      handleClose() {
        this.visibleLead = false;
        this.$refs.addData.clearValidate()
        this.$refs.addData.resetFields();
      },

      handleClose2() {
        this.visibleLead2 = false;
        this.$refs.addData.resetFields();
        this.$refs.addData.clearValidate()
      },

      //重置
      reset() {


      },

      //初始化数据
      initMessages5() {
        let data = {
          method: 'platformgoods.get',
        };
        this._post('/ecip.goods.center/execute',data)
          .then(res => {
            if (res.data.response.flag) {
              this.tableData5 = res.data.response.result;
              this.totalNum5 = res.data.response.total;

            }
          })


      },



      //当前页多少
      handleSizeChange(val) {
        this.pageSize5 = val
        this.area1.Size = val;
        this.initMessages5();


      },

      // 跳到第几页
      handleCurrentChange(val) {
        this.area1.page = val;
        this.curPage5 = val;
        this.initMessages5()


      },

      // 获取当前时间(今天)
      nowTime() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        this.applyTime = [new Date(year, month, strDate, 0, 0), new Date(year, month, strDate, 23, 59, 59)]
      },


    },

    mounted() {
      this.$nextTick(() => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 70;

      });
      window.onresize = () => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 80;
      };

      this.nowTime()
      this.initMessages5() //主数据
//
    },


  }
</script>
<style scoped>

</style>
<style>
  #internetGoods .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }

  #internetGoods .input-box .el-input__inner {
    padding: 0 5px !important;
    font-size: 12px !important;
  }

  #internetGoods .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #internetGoods .isspliec .el-dialog__body {
    padding: 20px !important;
  }

  #internetGoods .el-range-editor.el-input__inner {
    padding: 3px 2px;
    padding-left: 0;

  }

</style>
