<!--贾南风 账号-->
<template>
  <div id="account">
    <el-row :gutter="20" style="width:100%;">
      <el-col :span="6" style="padding: 0!important;height: 800px!important;overflow: auto">
        <div class="grid-content bg-purple"> <!--:expand-on-click-node="true"--><!---->
          <el-tree :data="tableData1" :props="defaultProps" ref="treeBox" node-key="departmentId" highlight-current
                   :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <div style="border-left: 1px solid #eee">
            <div id="searchBox">
              <div class="leftBox1" style="padding-left: 10px">
                <el-row>
                  <el-col :span="6">
                    <div class="grid-content">
                      <label for="name1">登录账号：</label>
                      <el-input id="name1" v-model="staffList.loginName" @keyup.enter.native="queryStaffList"
                                :maxlength="20" placeholder="请输入登录账号"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content">
                      <label for="name2">手机号：</label>
                      <el-input id="name2" v-model="staffList.phone" @keyup.enter.native="queryStaffList"
                                :maxlength="20" placeholder="请输入手机号"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content">
                      <label>状态：</label>
                      <el-select clearable v-model="staffList.status">
                        <el-option
                          v-for="item in status"
                          :key="item.label"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="rightBox1">
                <el-button size="mini" type="primary" class="queryButton" @click="queryStaffList">查 询</el-button>
              </div>
            </div>
            <div style="clear: both"></div>
            <div class="col-nav">
              <ul>
                <li @click="addStaff" v-if="!!authorityCode.UPMS_ACCOUNT_ADD"><span>添加</span></li>
                <li @click="deleteAccount" v-if="!!authorityCode.UPMS_ACCOUNT_DEL"><span>删除</span></li>
                <li @click="setup()" v-if="!!authorityCode.UPMS_ACCOUNT_SETUPMS"><span>设置权限</span></li>
                <li @click="amendB" v-if="!!authorityCode.UPMS_ACCOUNT_AMENDB"><span>修改部门</span></li>
                <li @click="startStopUsing(1)" v-if="!!authorityCode.UPMS_ACCOUNT_START"><span>启用</span></li>
                <li @click="startStopUsing(2)" v-if="!!authorityCode.UPMS_ACCOUNT_START"><span>停用</span></li>
              </ul>
            </div>
            <div style="height: 10px;border-left:0.5px solid #eee"></div>
          </div>
          <div>
            <el-table
              ref="box"
              id="fitTable"
              :height='table_h'
              :data="tableData2"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              border>  <!--@current-change="handleClick"-->
              <el-table-column
                align="center"
                type="index"
                width="50"
                label="序号">
              </el-table-column>
              <el-table-column
                align="center"
                :selectable="checkSelectable"
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="loginName"
                align="center"
                label="登录账号">
              </el-table-column>
              <el-table-column
                prop="userName"
                align="center"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="phone"
                align="center"
                :show-overflow-tooltip="true"
                label="手机号">
              </el-table-column>
              <el-table-column
                align="center"
                width="60"
                label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.userStatus == 1 || scope.row.userStatus == 4">启用</span>
                  <span v-if="scope.row.userStatus == 2">停用</span>
                  <span v-if="scope.row.userStatus == 3">锁定</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="departmentName"
                align="center"
                :show-overflow-tooltip="true"
                label="部门">
              </el-table-column>
              <el-table-column
                align="center"
                prop="privilegeName"
                :show-overflow-tooltip="true"
                label="角色">
              </el-table-column>
              <el-table-column
                prop="expiry1"
                align="center"
                label="账号截止有效期">
              </el-table-column>
              <el-table-column
                prop="remark"
                align="center"
                :show-overflow-tooltip="true"
                label="备注">
              </el-table-column>
              <el-table-column
                align="center"
                min-width="190"
                label="操作">
                <template slot-scope="scope">
                  <div style="white-space: nowrap" id="div">
                    <span v-if="scope.row.privilegeName != '系统管理员,' && !!authorityCode.UPMS_ACCOUNT_AMEND" @click="amendStaff(scope.row)">修改</span>
                    <span v-if="scope.row.privilegeName != '系统管理员,' && !!authorityCode.UPMS_ACCOUNT_RESETPASSWORDS" @click="resetPassword(scope.row)">重置密码</span>
                    <span v-if="scope.row.phone&&scope.row.privilegeName != '系统管理员,' && !!authorityCode.UPMS_ACCOUNT_PHONE" @click="solutionPhone(scope.row)">解绑手机</span>
                    <span @click="loginBook(scope.row)" v-if="!!authorityCode.UPMS_ACCOUNT_LOGINLOG">登录日志</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="col-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[15, 30, 50, 100,200]"
            :page-size="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <!--添加修改员工-->
    <div>
      <el-dialog v-dialogDrag
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="600px">
        <div style="padding-left: 50px;">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="部门名称：">
              <el-input v-model="ruleForm.departmentName" style="width: 280px" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="登录账号：" prop="loginName">
              <el-input v-model.trim="ruleForm.loginName" style="width: 280px"
                        :maxlength="20" :disabled="!isShow" placeholder="2-20位 汉字、大小写字母、数字"></el-input>
              <!--@keyup.native="ruleForm.loginName=ruleForm.loginName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"-->
            </el-form-item>
            <el-form-item v-if="isShow" label="密码：" prop="loginPassword">
              <el-input v-model.trim="ruleForm.loginPassword" style="width: 280px" placeholder="最少输入6位"></el-input>
            </el-form-item>
            <el-form-item v-if="!isShow" label="密码：" prop="loginPassword">
              <el-input type="password" v-model.trim="ruleForm.loginPassword" :disabled="true" style="width: 280px"
                        placeholder="最少输入6位"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="userName">
              <el-input v-model.trim="ruleForm.userName" style="width: 280px" @keyup.native="cleanSpelChar()" :maxlength="10"
                        placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="有效期截止：" prop="expiry">
              <el-date-picker
                v-model="ruleForm.expiry"
                type="date"
                :picker-options="pickerOptions1"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" v-model="ruleForm.remark" :maxlength="100" style="width: 280px"
                        placeholder="最多可输入100个汉字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="num == 1" type="primary" @click="submitForm('ruleForm')">添 加</el-button>
              <el-button v-else type="primary" @click="submitForm('ruleForm')">保 存</el-button>
              <el-button v-if="num == 1" @click="resetForm('ruleForm')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <!--修改部门-->
    <div>
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="修改部门"
        :visible.sync="dialogVisible3"
        width="400px"
      >
        <div style="width: 100%;height: 300px;border: 1px solid #eee;margin: -20px 0 -20px 0;overflow-y: scroll">
          <el-tree :data="tableData1" :props="defaultProps" :highlight-current="true" :default-expand-all="true"
                   :expand-on-click-node="true" @node-click="handleNodeClick1"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible3 = false">取 消</el-button>
    <el-button type="primary" @click="saveDepartment">保存</el-button>
  </span>
      </el-dialog>
    </div>
    <!--重置密码-->
    <div>
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="重置密码"
        :visible.sync="dialogVisible4"
        width='400px'>
        <div v-if="!showPassword" style="width: 100%;text-align: center;height: 130px;line-height: 100px;">
          <span>您确认要重置该账号的密码吗？</span>
        </div>
        <div v-if="showPassword" style="width: 100%;text-align: center;height: 130px;">
          <div class="input-wrapper">
            <span>新密码：</span>
            <el-input class="input" v-model="passWord.password" :maxlength="20" type="password"
                      @keyup.native="regData(1)"></el-input>
            <span v-if="isShow1"
                  style="color:#F56C6C;position: relative;left: -12px;width: 100px;top:-2px;">请输入6-20密码</span>
            <span v-if="isShow3"
                  style="color:#F56C6C;position: relative;left: -22px;width: 100px;top:-2px;">请输入新密码</span>
          </div>
          <div class="input-wrapper">
            <span>重复新密码：</span>
            <el-input class="input" v-model="passWord.confirmPassword" :maxlength="20" type="password"
                      @keyup.native="regData(2)"></el-input>
            <span v-if="isShow2"
                  style="color:#F56C6C;position: relative;left: 3px;top:-3px;width: 100px;text-align: left">请输入6-20密码</span>
            <span v-if="isShow4"
                  style="color:#F56C6C;position: relative;left: 3px;top:-2px;width: 100px;text-align: left">请输入重复新密码</span>
          </div>
        </div>
        <span class="footer" style="border: none!important;padding: 0!important;">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button type="primary" v-if="!showPassword" @click="showPassword=true">确 定</el-button>
          <el-button type="primary" v-if="showPassword" @click="savePassword">保 存</el-button>
        </span>
      </el-dialog>
    </div>
    <!--解绑手机-->
    <div>
      <el-dialog v-dialogDrag
        title="解绑手机"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible5"
        width='400px'>
        <div style="width: 100%;text-align: center;height: 130px;line-height: 130px;margin-top: -20px">
          <span>您确定要解绑该账号的手机号吗？</span>
        </div>
        <span class="footer" style="border: none!important;padding: 0!important;">
          <el-button @click="dialogVisible5 = false">取 消</el-button>
          <el-button type="primary" @click="makeSure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!--登录日志-->
    <div>
      <el-dialog v-dialogDrag
        title="登录日志"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible6"
        width='700px'>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <label>操作时间：</label>
              <el-date-picker
                type="date"
                v-model="logTime"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="queryLog">查 询</el-button>
            </div>
          </el-col>
        </el-row>
        <div>
          <el-table
            :data="tableData"
            :height="400"
            border
            style="width: 100%">
            <el-table-column
              label="操作类型">
              <template slot-scope="scope">
                <span v-if="scope.row.optionType == 1">登录</span>
                <span v-if="scope.row.optionType == 2">修改密码</span>
                <span v-if="scope.row.optionType == 3">绑定手机号</span>
                <span v-if="scope.row.optionType == 4">解绑</span>
                <span v-if="scope.row.optionType == 5">登出</span>
                <span v-if="scope.row.optionType == 6">获取验证码</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作内容">
              <template slot-scope="scope">
                <span v-if="scope.row.optionType == 1">登录</span>
                <span v-if="scope.row.optionType == 2">修改密码</span>
                <span v-if="scope.row.optionType == 3">绑定手机号</span>
                <span v-if="scope.row.optionType == 4">解绑</span>
                <span v-if="scope.row.optionType == 5">登出</span>
                <span v-if="scope.row.optionType == 6">获取验证码</span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              prop="createTime"
              label="操作时间">
            </el-table-column>
            <el-table-column
              align="right"
              prop="publicIp"
              label="IP">
            </el-table-column>
          </el-table>
          <div class="dialog-pagination">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage1"
              :page-sizes="[15, 30, 50, 100, 200]"
              :page-size="totalPage1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum1">
            </el-pagination>
          </div>
        </div>
        <div style="width: 100%;text-align: center;margin-top: 16px">
          <el-button @click="dialogVisible6 = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {isValidPhone, isEmail} from '../../config/validate';

  export default {
    data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入登录账号'));
        }
        if ((/^[0-9]*$/g.test(value)) || value.length < 2) {
          callback(new Error("2-20位，汉字、大小写字母、数字,且不能由纯数字组成"));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('密码不能为空'));
        } else if (value.length < 6) {
          callback(new Error('密码不能小于六位'));
        } else {
          callback()
        }
      };
      var validateLogin = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入姓名'));
        } else if (value.length < 2) {
          callback(new Error("2-10位，首位必须为汉字"));
        } else if (!(/^[\u4e00-\u9fa5]/g.test(value))) {
          callback(new Error("2-10位，首位必须为汉字"));
        } else {
          callback()
        }
      };
      var validateEmail = (rule, value, callback) => { //
        if (value === '') {
          callback(new Error('请输入Email'));
        } else if (!isEmail(value)) {
          callback(new Error('请输入正确的E-mail'))
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!isValidPhone(value)) {
          callback(new Error('请输入正确11位手机号码'))
        } else {
          callback()
        }
      };
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now(); // 没有发生的时间
          },
        },
        title: '',
        level: '',
        queryC: () => { // 获取公司下的所有部门方法
        },
        queryDa: () => { // 部门下对应员工方法
        },
        queryGroups: () => { //获取权限组方法
        },
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        version: '1.0.0', // 版本号
        authority:{},// 权限
        checkBox: '',// 选中的部门
        dialogVisible: false, // 添加员工弹层
        dialogAmend: false, // 修改员工弹层
        dialogVisible1: false, // 店铺
        dialogVisible2: false, //仓库
        dialogVisible3: false, // 修改部门树
        dialogVisible4: false, // 重置密码
        showPassword: false, // 密码框
        dialogVisible5: false, // 解绑手机
        dialogVisible6: false, // 登录日志
        department: '', //修改部门的ID
        // 表格里的显示隐藏状态
        isShow: false,
        isShow1: false,
        isShow2: false,
        isShow3: false,
        isShow4: false,
        status: [ // 状态枚举
          {label: '启用', value: 1},
          {label: '停用', value: 2},
          {label: '锁定', value: 3}
        ],
        staffLeft: {   // 左边部门树参数
          companyId: '2B7CA39EB9644334A4570459F9029385',
        },
        defaultProps: { // tree绑定的参数
          children: 'nodes',
          label: 'departmentName'
        },
        staffName: '',//员工姓名
        userId: '', // 要删除员工的ID
        userIdSure: '',// 解绑手机的ID
        table_h: 1, // 表格高度
        tableData1: [], // 部门接受
        tableData2: [], // 员工接受
        staffList: { // 获取员工列表的参数
          departmentId: '',
          phone: '',
          loginName: '',
          status: '',
          page: 1,
          size: 15
        },
        num: '',// 判断保存还是重置
        groups: [], // 权限组接受
        totalPage: 15, // 要显示的条数
        currentPage: 1, // 页数
        totalNum: 0, // 总条数
        totalPage1: 15, // 要显示的条数
        currentPage1: 1, //页数
        totalNum1: 0,// 总条数
        ruleAmend: {},// 修改回显的字段
        departmentName: '', //添加部门的回显
        update: { // 修改提交的字段
          userId: '',
          companyId: '',
          departmentId: '',
          departmentName: '',
          userName: '',
          loginName: '',
          userType: '',
          phone: '',
          email: '',
          groupIds: ''
        },
        dog: 1, // 看门狗
        passWord: { // 重置密码参数
          loginName: '',
          companyId: '',
          password: '',
          confirmPassword: '',
          isAdmin: true
        },
        ruleForm: { // 添加的字段
          departmentId: '', // 部门ID
          loginName: '', // 登陆名称
          loginPassword: '', // 登陆密码
          userName: '', // 姓名
          expiry: '', // 有效期传入时间戳
          remark: '', // 备注
        },
        loginLog: { //登录日志参数
          userId: '',
          startTime: '',
          endTime: '',
          page: 1,
          size: 15
        },
        failed: 0, // 统计账号过期条数
        successD: 0, // 保存全部的的账号条数
        tableData: [], // 员工
        logTime: '', // 操作日志的时间
        rules: { // 表单校验
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {validator: validateLogin}
          ],
          loginName: [
            {required: true, message: '请输入登录账号'},
            {validator: validateName}
          ],
          loginPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
        },

      }
    },
    methods: {
      //如果当前是系统管理员不允许选中
      checkSelectable(row) {
        return row.privilegeName != '系统管理员,';
      },
      close() {
        if (window != top) {
          top.location.href = location.href;
        }
      },
      // 格式化0-9
      turnSingle(num) {
        return num < 10 ? '0' + num : num
      },
      // 特殊字符 （姓名）
      cleanSpelChar() {
        this.ruleForm.userName = this.ruleForm.userName.replace(/["'<>%$#@￥|*~_;)(&+]/, ''); // 特殊字符
      },
      // 查询日志按钮
      queryLog() {
        // 格式化时间
        if (this.logTime) {
          var y = this.logTime.getFullYear();
          var m = this.logTime.getMonth() + 1;
          m = m < 10 ? '0' + m : m;
          var d = this.logTime.getDate();
          d = d < 10 ? ('0' + d) : d;
          this.logTime = y + '-' + m + '-' + d;
          this.loginLog.startTime = new Date(Date.parse(this.logTime.replace(/-/g, "/"))).getTime();
          this.loginLog.endTime = new Date().setTime(Date.parse(this.logTime.replace(/-/g, "/")) / 1000 + 24 * 60 * 60 - 1) * 1000;
        }
        this.loginPort(); // 调用
      },
      // 点击登录日志
      loginBook(row) {
        this.logTime = '';
        this.dialogVisible6 = true;
        this.loginLog.userId = row.userId;
        this.loginPort(); // 调用
      },
      loginPort() { // 登录日志调用
        this._post('com.edb01.upms.service.LoginLogService/' + this.version + '/getByPage', this.loginLog)
          .then(res => {
            if (res.data.success == true) {
              res.data.result.rows.forEach(item => {
                let a = new Date(new Date(item.createTime));
                item.createTime = a.getFullYear() + '-' + this.turnSingle(a.getMonth() + 1) + '-' + this.turnSingle(a.getDate()) + ' ' + this.turnSingle(a.getHours()) + ':' + this.turnSingle(a.getMinutes()) + ':' + this.turnSingle(a.getSeconds());
              });
              this.tableData = res.data.result.rows;
              this.totalNum1 = res.data.result.total;

            }
          })
      },
      // 启用停用账号
      startStopUsing(status) {
        let str1 = '';
        if (status == 1) {
          str1 = '启用';
          if (this.checkBox.length === 0) {
            this.$message({
              message: '请选择要' + str1 + '的账号',
              type: 'warning'
            });
            return false;
          }
          let time = Date.parse(new Date());
          if (this.checkBox.length == 1) {
            if (this.checkBox[0].expiry < time) {
              this.$message({
                message: '该账户已过期，请修改有效期后再启用',
                type: 'warning'
              });
              return false;
            }
          } else {
            this.successD = this.checkBox.length;
            this.failed = 0;
            this.checkBox.forEach((item, index) => {
              if (item.expiry < time) {
                this.failed++;
                this.checkBox.splice(index, 1)
              }
            });

            if (this.successD == this.failed) { // 判断是不是全部过期
              this.$message({
                message: '勾选账号均为过期账号，请修改有效期后再启用',
                type: 'warning'
              });
              return false;
            }
          }
        } else {
          str1 = '停用';
          if (this.checkBox.length === 0) {
            this.$message({
              message: '请选择要' + str1 + '的账号',
              type: 'warning'
            });
            return false;
          }
        }
        this.$confirm('是否' + str1 + '选中的账号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          let str = '';
          for (let item of this.checkBox) { // 库位ID，用逗号隔开
            str += item.userId + ','
          }
          // 改变状态
          this._post('com.edb01.upms.service.UserService/' + this.version + '/updateUserStatus', {
            userId: str.slice(0, -1),
            status: status
          })
            .then((res) => {
              if (res.data.success == true) {
                if (status == 1) {
                  if (this.failed == 0) {
                    this.$message({
                      message: '启用成功',
                      type: 'success'
                    });
                  } else {
                    this.$message({
                      message: '启用成功，其中' + this.failed + '个账号已过期失败，请修改有效期后再启用！',
                      type: 'success'
                    });
                  }
                } else {
                  this.$message({
                    message: str1 + '成功',
                    type: 'success'
                  });
                }
                this.queryDa(this.staffList);//重新渲染数据
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }).catch(() => {
          this.$message({//  取消删除提示
            type: 'info',
            message: '已取消'
          })
        })

      },
      // 确定解绑手机接口
      makeSure() {
        this._post('com.edb01.upms.service.UserService/' + this.version + '/unBindMobile', {userId: this.userIdSure})
          .then(res => {
            if (res.data.success == true) {
              this.$message({
                message: '解绑手机成功',
                type: 'success'
              });
              this.dialogVisible5 = false;
              this.queryDa(this.staffList);//重新渲染数据
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
      },
      // 重置密码（当前行账号）
      resetPassword(row) {
        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
        this.isShow4 = false;
        this.passWord.loginName = row.loginName;
        this.passWord.companyId = row.companyId;
        this.showPassword = false;
        this.dialogVisible4 = true;
        this.passWord.password = '';
        this.passWord.confirmPassword = '';
      },
      // 保存重置的密码
      savePassword() {
        // 提交之前的验证
        if (this.isShow1 || this.isShwo2) {
          return false;
        }
        if (!this.passWord.password && !this.passWord.confirmPassword) {
          this.isShow3 = true;
          this.isShow4 = true;
          return false;
        } else {
          this.isShow3 = false;
          this.isShow4 = false;
        }
        if (!this.passWord.password) {
          this.isShow3 = true;
          return false;
        } else {
          this.isShow3 = false;
        }
        if (!this.passWord.confirmPassword) {
          this.isShow4 = true;
          return false;
        } else {
          this.isShow4 = false;
        }
        // 两次密码输入的一致校验
        if (this.passWord.password !== this.passWord.confirmPassword) {
          this.$message({
            message: '请输入相同的密码',
            type: 'warning'
          });
          return false;
        }

        //保存重置的密码接口
        this._post('com.edb01.upms.service.UserService/' + this.version + '/updateUserPassword', this.passWord)
          .then(res => {
            if (res.data.success == true) {
              this.$message({
                message: '密码重置成功',
                type: 'success'
              });
              this.queryDa(this.staffList); // 重置成功渲染数据
              this.dialogVisible4 = false; // 关闭弹框
              let timer = setTimeout(() => {
                this.showPassword = false;
              }, 10);
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 重置密码的里的验证
      regData(num) { // /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/
        if (num == 1) {
          if (this.passWord.password.length < 6) {
            this.isShow1 = true;
            this.isShow3 = false;
          } else {
            this.isShow1 = false;
          }
        } else if (num == 2) {
          if (this.passWord.confirmPassword.length < 6) {
            this.isShow2 = true;
            this.isShow4 = false;
          } else {
            this.isShow2 = false;
          }
        }
      },
      // 删除账号
      deleteAccount() {
        let status = false;
        this.checkBox.forEach(item => {
          if (item.userStatus == 1) {
            this.$message({
              message: '启用的账号无法删除，请先停用后再删除！',
              type: 'warning'
            });
            status = true;
          }
        });
        if (status) {
          return false;
        }
        if (this.checkBox.length === 0) {
          this.$message({
            message: '请选择要删除的账号',
            type: 'warning'
          });
          return false;
        }

        this.$confirm('是否删除选中的账号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          let str = '';
          for (let item of this.checkBox) { // 库位ID，用逗号隔开
            str += item.userId + ','
          }
          this._post('com.edb01.upms.service.UserService/' + this.version + '/delete', {userId: str.slice(0, -1)})
            .then((res) => {
              if (res.data.success == true) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.queryDa(this.staffList);
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }).catch(() => {
          this.$message({//  取消删除提示
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 点击部门的保存
      saveDepartment() {
        if (!this.department) {
          this.$message({
            message: '请选择要修改的部门',
            type: 'warning'
          });
          return false;
        } else if (this.department == 1) {
          this.$message({
            message: '不允许修改部门为主公司',
            type: 'warning'
          });
          return false;
        }
        let userId = '';
        this.checkBox.forEach(item => {
          userId += item.userId + ',';
        });

        this._post('com.edb01.upms.service.UserService/' + this.version + '/updateUserDepartment', {
          userId: userId.slice(0, -1),
          departmentId: this.department
        })
          .then(res => {
            if (res.data.success == true) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.dialogVisible3 = false;
              this.queryDa(this.staffList);
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })


      },
      // 点击修改部门
      amendB() {
        if (this.checkBox.length === 0) {
          this.$message({
            message: '请选择要修改的账号',
            type: 'warning'
          });
          return false;
        }

        this.dialogVisible3 = true;
      },
      // 解绑手机
      solutionPhone(row) {
        console.log(row);
        this.userIdSure = row.userId;
        this.dialogVisible5 = true;
      },
      // 点击设置权限
      setup() {
        if (this.checkBox.length === 0) { // 是否选择用户
          this.$message({
            message: '请选择要设置权限的账号',
            type: 'warning'
          });
          return false
        } else if (this.checkBox.length === 1) { // 当选择一个账号的时候
          this.$router.push({name: 'setupQ', params: {userId: this.checkBox[0].userId}});
          this.dog = 2;
        } else { // 当选择多个账号的时候
          this.dog = 2;
          let userId = '';
          this.checkBox.forEach(item => {
            userId += item.userId + ',';
          });
          userId = userId.slice(0, -1);
          this.$router.push({name: 'setupQ', params: {userId: userId}});
        }
      },
      // 选择复选框触发的方法
      handleSelectionChange(val) {
        //console.log(val);
        this.checkBox = val;
        //console.log(this.checkBox.length);
      },
      handleCurrentChange(val) {
        //console.log(val);
        this.currentPage = val;
        this.staffList.page = this.currentPage;
        this.staffList.size = this.totalPage;
        this.queryDa(this.staffList);
      },
      // 每页多少条
      handleSizeChange(val) {
        //console.log(val)
        this.totalPage = val;
        this.staffList.page = this.currentPage;
        this.staffList.size = this.totalPage;
        this.queryDa(this.staffList)
      },
      handleCurrentChange1(val) {
        //console.log(val);
        this.currentPage1 = val;
        this.loginLog.page = this.currentPage1;
        this.loginLog.size = this.totalPage1;
        this.loginPort();
      },
      // 每页多少条
      handleSizeChange1(val) {
        //console.log(val)
        this.totalPage1 = val;
        this.loginLog.page = this.currentPage1;
        this.loginLog.size = this.totalPage1;
        this.loginPort()
      },
      // 点击部门触发的方法
      handleNodeClick(row) {
        console.log(row);
        this.level = row.level; // 判断是不是公司
        this.ruleForm.companyId = row.companyId;
        this.ruleForm.departmentId = row.departmentId;
        this.departmentName = row.departmentName;
        this.staffList.departmentId = row.departmentId;
        localStorage.setItem('level', row.level);
        localStorage.setItem('staffId', row.departmentId);
        localStorage.setItem('staffName', row.departmentName);
        this.queryDa(this.staffList)
      },
      handleNodeClick1(row) {
        if (row.level == 1) {
          this.$message({
            message: '不允许修改部门为主公司',
            type: 'warning'
          });
          this.department = 1;
        } else {
          this.department = row.departmentId;
        }

      },
      // 点击查询员工列表
      queryStaffList() {
        //console.log(this.staffList);

        //this.staffList.page = this.currentPage;
        //this.staffList.size = this.totalPage;
        this.queryDa(this.staffList)
      },
      // 点击员工表格行触发
      handleClick(row) {
        this.update.companyId = row.companyId;
        this.update.departmentId = row.departmentId;
        this.update.userId = row.userId;
        this.staffName = row.loginName;
        this.userId = row.userId;
        console.log(row);
      },
      // 点击修改员工
      amendStaff(row) {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields();
        });
        console.log(row);
        this.isShow = false; // 密码框不显示
        this._post('com.edb01.upms.service.UserService/' + this.version + '/get', {userId: row.userId})
          .then((res) => {
            if (res.data.success == true) {
              this.ruleForm = res.data.result;
              this.num = 2;
              this.title = '修改员工';
              this.dialogVisible = true;
              if (this.ruleForm.expiry == 0) {
                this.ruleForm.expiry = '';
              }
            }
          })

      },
      // 点击删除员工
      delStaff() {
        if (this.userId == '') {
          this.$message({
            message: '请选择要删除的员工',
            type: 'warning'
          });
          return false
        }
        this.$confirm('是否删除员工' + this.staffName + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._post('com.edb01.upms.service.UserService/' + this.version + '/delete', {userId: this.userId})
            .then((res) => {
              if (res.data.code == 0) {
                this.queryDa(this.staffList);
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      // 点击新增员工按钮
      addStaff() {
        if (this.level == 1) { // 公司下不可以添加员工
          this.$message({
            message: '账号所属部门不能为公司，请选择账号所属次级部门',
            type: 'warning'
          });
          return false;
        }
        ;
        if (this.ruleForm.departmentId == '') {
          this.$message({
            message: '请选择部门',
            type: 'warning'
          });
          return false
        }
        if (this.departmentName == '') {
          this.$message({
            message: '请选择部门',
            type: 'warning'
          });
          return false
        }
        this.title = '添加员工';
        this.num = 1;
        this.dialogVisible = true;
        // 置空上次输入的值
        this.ruleForm.userName = '';
        this.ruleForm.loginName = '';
        this.ruleForm.loginPassword = '';
        this.ruleForm.remark = '';
        this.ruleForm.expiry = '';
        this.isShow = true;
        var trimer = setTimeout(() => {
          this.$nextTick(() => {
            this.$refs['ruleForm'].resetFields();
          });
        }, 100)
      },
      // 点击添加员工
      submitForm(formName) {
        let self = this;
        if (self.ruleForm.expiry == '') {

        } else {
          self.ruleForm.expiry = Date.parse(new Date(self.ruleForm.expiry));
        }
        self.ruleForm.userType = '200';
        self.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.num == 1) {
              self._post('com.edb01.upms.service.UserService/' + self.version + '/add', self.ruleForm)
                .then((res) => {
                  // console.log(res.data.result);
                  if (res.data.success == true) {
                    self.dialogVisible = false;
                    self.queryDa(self.staffList);
                    self.$message({
                      message: '添加成功',
                      type: 'success'
                    });
                  } else if (res.data.success == false) {
                    if (res.data.result == -1) {
                      self.$message({
                        message: '同一公司不能添加相同登录账号',
                        type: 'warning'
                      })
                    } else {
                      self.$message({
                        message: res.data.msg,
                        type: 'warning'
                      })
                    }
                  } else {
                    self.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
            } else if (this.num == 2) {
              self._post('com.edb01.upms.service.UserService/' + self.version + '/update', self.ruleForm)
                .then((res) => {
                  if (res.data.code == 0) {
                    self.dialogVisible = false;
                    self.queryDa(self.staffList);
                    self.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                    self.resetAmend('ruleForm');
                  } else {
                    self.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置修改表单
      resetAmend(formName) {
        this.$refs[formName].resetFields();
      },
      // 重置添加表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      this.$nextTick(function () {
        this.table_h = $(window).height() - $('#fitTable').offset().top - 80;
      });
      // 部门下的对应员工
      this.queryDa = (par) => {
        this._post('com.edb01.upms.service.UserService/' + this.version + '/getByPager', par)
          .then((res) => {
            if (res.data.code == 0) {
              res.data.result.rows.forEach((item) => {
                if (item.expiry == 0) {
                  item.expiry1 = '';
                } else {
                  let a = new Date(new Date(item.expiry));
                  item.expiry1 = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate();
                }
              });

              this.tableData2 = res.data.result.rows;
              this.totalNum = res.data.result.total;
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      };
      //获取权限组
      this.queryGroups = () => {
        this._post('com.edb01.upms.service.PrivilegeGroupService/' + this.version + '/list')
          .then((res) => {
            if (res.data.code == 0) {
              this.groups = res.data.result
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      };
      this.queryGroups(); // 权限组调用
      // 获取公司下的所有部门
      this.queryC = () => {
        this._post('com.edb01.upms.service.DepartmentService/' + this.version + '/getAll')
          .then((res) => {
            if (res.data.code == 0) {
              let result = res.data.result;
              this.tableData1.push(result);
              this.departmentName = result.departmentName; // 把当前部门存起来
              if (localStorage.getItem('staffId')) {
                this.ruleForm.companyId = res.data.result.companyId;
                this.level = localStorage.getItem('level');
                this.ruleForm.departmentId = localStorage.getItem('staffId');
                this.staffList.departmentId = localStorage.getItem('staffId');
                this.$nextTick(() => {
                  this.$refs.treeBox.setCurrentKey(localStorage.getItem('staffId'));
                });
                this.departmentName = localStorage.getItem('staffName');
                this.queryDa(this.staffList)
              } else {
                this.staffList.departmentId = result.departmentId; // 获取当前部门的id
                this.queryDa(this.staffList); // 渲染数据
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      };
      this.queryC();
      /* this.$nextTick(function(){
         this.$refs.treeBox.setCurrentKey('0');  //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
       })

        this.$nextTick(function(){
          this.$refs.treeBox[0].click();
        })*/
    },
    mounted() {
      //回车事件
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode == 13) { // enter 键
          //调接口
          this.queryStaffList();
        }
      };
      /* console.log($('.queryButton'));
       $('.queryButton').trigger('click');*/
      //this.$('.queryButton').trigger('click');
      /*this.$nextTick( () => {
        this.$refs.treeBox.setCurrentKey(0);
      })*/

      //console.log(localStorage.getItem('staffId'),8888);
      /* let trimer = setTimeout(() => {
         this.$refs.treeBox.setCurrentKey(0);
       },500)*/
    }
  }
</script>
<style scoped>
  #div span {
    cursor: pointer;
    color: #409EFF;
    margin-right: 4px;
  }
  .input-wrapper span {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .input-wrapper .input {
    width: 180px;
  }
  .input-wrapper {
    height: 60px;
  }
  #account {
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 0 10px 20px;
  }
</style>
<style>
  #account .footer {
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  #account .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #C6DEF5;
  }

  #account .el-icon-caret-right:before {
    font-size: 20px;
  }

  #account .el-icon-caret-right:before {
    margin-bottom: 10px;
  }

  #account .el-tree-node__expand-icon {
    color: #2196F3 !important;
  }

  #account .el-form-item {
    margin-bottom: 10px;
  }

  #account .el-form-item__error {
    top: 90% !important;
  }
</style>
