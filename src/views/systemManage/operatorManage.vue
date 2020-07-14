<template>
  <el-card>
    <searchs :formData="formData" :searchBtn="searchBtn" />
    <tables
      v-loading="tablesLoading"
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <!--新增 & 编辑模态框-->
    <el-dialog
      :title="operatorDialogTitle"
      :visible.sync="operatorDialog"
      width="25%"
      @close="dialogClose('operatorForm')"
      :close-on-click-modal="false"
    >
      <el-form
        style="width:320px"
        :model="operatorForm"
        :rules="rules"
        ref="operatorForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item label="登录名" prop="name">
          <el-input
            placeholder="请输入登录名"
            v-if="operatorDialogTitle==='新增'"
            v-model.trim="operatorForm.name"
          ></el-input>
          <span v-else>{{operatorForm.name}}</span>
        </el-form-item>
        <el-form-item v-if="operatorDialogTitle==='编辑'" label="角色授权" prop="name">
          <el-tag type="success" v-for="tag in beAuth" :key="tag.name">{{tag.name}}</el-tag>
          <el-button v-if="!beAuth.length" @click="reAuth">{{needReAuth?'取消':'授权'}}</el-button>
          <el-button v-else style="margin-left:10px" @click="reAuth">{{needReAuth?'取消':'重新授权'}}</el-button>
        </el-form-item>
        <el-form-item label="可授角色" v-if="needReAuth">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="item in canAuth" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input placeholder="请输入真实姓名" v-model.trim="operatorForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input placeholder="请输入联系电话" v-model.number="operatorForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="operatorForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="E-MAIL">
          <el-input v-model.trim="operatorForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('operatorForm')">提交</el-button>
          <el-button type="primary" v-if="operatorDialogTitle==='编辑'" @click="resetPWD">重置密码</el-button>
          <el-button @click="operatorDialog = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryOperator,
  addOperator,
  operatorInfo,
  editOperator,
  operatorGetAuth,
  operatorAuth,
  enableOperator,
  disableOperator,
  closeOperator,
  resetPw
} from "@/api/management/systemManage";
import initData from "@/mixins/initData";
import { restore } from "@/utils/restoreModel";
export default {
  mixins: [initData],
  name: "operator-manage",
  data() {
    // 自定义联系电话规则
    var checkPhone = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入操作员联系电话"));
      } else if (isNaN(value)) {
        callback(new Error("联系电话必须为数字值"));
      } else if (value.toString().length != 11) {
        callback(new Error("请输入正确的联系电话"));
      }
      callback();
    };
    return {
      operatorDialogTitle: "",
      operatorDialog: false,
      operatorForm: {
        //个人信息参数
        realName: "", //真实姓名
        name: "", //登录名
        phone: "", //联系电话
        sex: "", //性别
        email: "", //电子邮箱
        // birthday: "", //出生日期
        headPicPath: "" //头像url
      },
      // 验证规则
      rules: {
        name: [
          {
            required: true,
            message: "操作员登录名不能为空",
            tigger: "blur"
          }
        ],
        realName: [
          { required: true, message: "请输入操作员真实姓名", tigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }]
      },
      tableCols: [
        {
          prop: "name",
          label: "登录名",
          align: "center"
        },
        {
          prop: "realName",
          label: "真实姓名",
          align: "center"
        },
        {
          prop: "phone",
          label: "联系电话",
          align: "center"
        },
        {
          prop: "sex",
          label: "性别",
          align: "center",
          formatter: row => (row.sex === 1 ? "男" : "女")
        },
        {
          prop: "email",
          label: "E-MAIL",
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "创建时间",
          align: "center"
        },
        {
          prop: "loginDatetime",
          label: "最后登录时间",
          align: "center"
        },
        {
          prop: "editPassDatetime",
          label: "最后修改时间",
          align: "center"
        },
        {
          prop: "status",
          label: "状态",
          align: "center",
          type: "switch",
          change: this.statusChange
        },
        {
          label: "操作",
          align: "center",
          type: "button",
          btnList: [
            { type: "primary", label: "编辑", handle: this.editOperator },
            { type: "danger", label: "删除", handle: this.deleteOperator }
          ]
        }
      ],
      formData: [
        {
          type: "input",
          label: "登录名",
          model: "name",
          placeholder: "请输入登录名"
        },
        {
          type: "input",
          label: "手机号码",
          model: "phone",
          placeholder: "请输入手机号码"
        },
        {
          type: "select",
          label: "状态",
          model: "status",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "启用",
              value: 1
            },
            {
              label: "禁用",
              value: 0
            }
          ]
        }
      ],
      searchBtn: [
        {
          type: "primary",
          label: "新增",
          handle: this.add,
          icon: "el-icon-edit"
        },
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ],
      tablesLoading: false,
      beAuth: [], //已授权角色
      canAuth: [], //可授权角色
      needReAuth: false, //是否重新授权
      operatorDialogTitle: "",
      roleIds: [] //角色ID集合
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取景区列表
    async getTableData(
      query = {
        ...this.searchForm,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await queryOperator(query);
        this.pagination.total = data.value.total;
        // 将后台返回的数据处理为符合switch组件的数据
        this.tableData = data.value.list.map(v => {
          // 将0和1转换为布尔值
          v.status = !!v.status;
          return v;
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tablesLoading = false;
      }
    },

    // 切换操作员状态
    async statusChange(row) {
      try {
        if (row.status) {
          await enableOperator({ id: row.id });
          this.$message.success(`已启用${row.name}`);
        } else {
          await disableOperator({ id: row.id });
          this.$message.info(`已禁用${row.name}`);
        }
      } catch (err) {
        // 错误时恢复
        row.status = !row.status;
      }
    },

    // 获取操作员信息
    async getOperatorInfo() {
      const { data } = await operatorInfo({ id: this.id });
      this.operatorForm = data.value;
      console.log(this.operatorForm);
    },

    // 获取操作员授权信息
    async getOperatorAuth() {
      const { data } = await operatorGetAuth({ id: this.id });
      this.beAuth = data.value.beAuth;
      this.canAuth = data.value.canAuth;
    },

    // 编辑操作员
    editOperator(row) {
      this.operatorDialogTitle = "编辑";
      this.operatorDialog = true;
      this.id = row.id;
      // 回填数据
      this.getOperatorInfo();
      this.getOperatorAuth();
    },

    // 重新授权按钮
    reAuth() {
      this.needReAuth = !this.needReAuth;
    },

    // 新增操作员
    add() {
      this.operatorDialogTitle = "新增";
      this.operatorDialog = true;
    },

    // 提交编辑&新增
    submitForm(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          try {
            if (this.operatorDialogTitle === "编辑") {
              // 如果在编辑时同时进行了重授权
              if (this.needReAuth) {
                await Promise.all[
                  editOperator(
                    { id: this.id, ...this[form] },
                    operatorAuth({ id: this.id, roleIds: this.roleIds })
                  )
                ];
              } else {
                await editOperator({ id: this.id, ...this[form] });
              }
              this.$message.success("修改成功");
              this.operatorDialog = false;
              this.getTableData();
            } else {
              // 新增时 首先获取ID
              await addOperator(this[form]);
              this.$message.success("新增成功");
              this.operatorDialog = false;
              this.getTableData();
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    },

    // 删除操作员
    deleteOperator(row) {
      this.$confirm("此操作将永久删除该操作员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await closeOperator({ id: row.id });
            this.$message.info("删除成功");
            // 删除时如果是该页最后一条数据则回到上一页
            const { total, size, num } = this.pagination;
            const edge = Math.ceil((total - 1) / size);
            edge < num && this.pagination.num--;
            this.getTableData();
          } catch (err) {}
        })
        .catch();
    },

    // 重置密码
    resetPWD() {
      this.$confirm("是否重置该操作员的密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await resetPw({ id: this.id });
            this.$message.success("重置密码成功");
            this.operatorDialog = false;
            this.getTableData();
          } catch (err) {}
        })
        .catch();
    },

    // 关闭对话框
    dialogClose(formName) {
      // 数据和校验规则还原
      this.beAuth = [];
      this.canAuth = [];
      this.operatorForm = restore(this.operatorForm);
      this.needReAuth = false;
      this.$refs[formName].resetFields();
      this.roleIds = [];
    },

    // 按钮查询
    query(searchForm) {
      if (_.isEmpty(searchForm)) return this.$message.warning("无效的查询");
      this.searchForm = searchForm;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    }
  }
};
</script>

<style scoped>
.my_headpic {
  /*border:1px solid red;*/
  display: flex;
  justify-content: center;
}
.my_headpic > div {
  /*border:1px solid red;*/
  display: flex;
  overflow: hidden;
}
.my_inputt {
  border: 1px solid red;
  opacity: 0;
}
</style>
