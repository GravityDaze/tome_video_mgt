<template>
  <div>
    <mySearchs
      :isParamKey="isParamKey"
      :isParamValue="isParamValue"
      :isCanEdit="isCanEdit"
      :addBtn="addBtn"
      :editBtn="editBtn"
      :RedisBtn="RedisBtn"
      @queryInfoFn="queryInfoFn"
      @beforeAddFn="beforeAddFn"
      @beforeEditFn="beforeEditFn"
      @sureRedisFn="sureRedisFn"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :tableTitle="tableTitle"
      :tableData="tableData"
      :isShowEnabled="isShowEnabled"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>

    <div id="addEditorForm">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.systemParamSign"
        width="30%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="参数键" prop="paramKey">
                <el-col>
                  <el-input v-model.trim="ruleForm.paramKey"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="参数值" prop="value">
                <el-col>
                  <el-input v-model.trim="ruleForm.value"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="参数值规则" prop="regularExpression">
                <el-col>
                  <el-input v-model.trim="ruleForm.regularExpression"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="可否编辑" prop="edit">
                <el-radio-group v-model="ruleForm.edit">
                  <el-radio label="可以"></el-radio>
                  <el-radio label="不可以"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="描述">
                <el-col>
                  <el-input
                    type="textarea"
                    maxlength="100"
                    show-word-limit
                    :autosize="{minRows:4,maxRows:6}"
                    v-model.trim="ruleForm.description"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <!--<el-col :span="4" :offset="2">-->
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
            <!--</el-col>-->
            <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "system-params",
  data() {
    return {
      apiQuery: "/videomis/param/query",
      apiAdd: "/videomis/param/add",
      apiGetEditInfo: "/videomis/param/get",
      apiEdit: "/videomis/param/edit",
      apiRedis: "/videomis/param/sycn",
      sign: "systemparams",
      isParamKey: true,
      isParamValue: true,
      isCanEdit: true,
      addBtn: true,
      editBtn: true,
      RedisBtn: true,
      isShowEnabled: true,
      commonId: "",
      ruleForm: {
        id: "",
        paramKey: "",
        value: "",
        regularExpression: "",
        edit: "",
        description: ""
      },
      // 验证规则
      rules: {
        paramKey: [{ required: true, message: "请输入参数键", tigger: "blur" }],
        value: [{ required: true, message: "请输入参数值", tigger: "blur" }],
        regularExpression: [
          { required: true, message: "请输入参数值规则", tigger: "blur" }
        ],
        edit: [
          {
            required: true,
            message: "请选择此参数信息是否可编辑",
            trigger: "change"
          }
        ]
      },
      tableTitle: [
        {
          prop: "paramKey",
          label: "参数键",
          // width: '100',
          align: "center"
        },
        {
          prop: "value",
          label: "参数值",
          // width: '180',
          align: "center"
        },
        {
          prop: "regularExpression",
          label: "参数值规则",
          // width: '100',
          align: "center"
        },
        {
          prop: "description",
          label: "描述",
          // width: '180',
          align: "center"
        },
        {
          prop: "edit",
          label: "是否可编辑",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.edit == "1" ? "可编辑" : "不可编辑";
          }
        }
      ],
      tableData: [
        // {
        //   paramKey: 'key_8',
        //   paramValue: '00080',
        //   valueRegulation: '我是规则实例一',
        //   discrible: '描述一',
        //   isEdit:1,
        // },
      ]
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfoFn();
  },
  methods: {
    getDefaultInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          paramKey: "",
          value: "",
          edit: ""
        }
      })
        .then(res => {
          // console.log("列表信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData = [...res.data.value.list];
              this.$store.state.totalParam = res.data.value.total;
            } else {
              this.tableData = [];
              this.$store.state.totalParam = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    queryInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          paramKey: this.$store.state.paramKeyParam,
          value: this.$store.state.paramValueParam,
          edit: this.$store.state.editParam
        }
      })
        .then(res => {
          // console.log("查询按钮或者翻页按钮信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData = [...res.data.value.list];
              this.$store.state.totalParam = res.data.value.total;
            } else {
              this.tableData = [];
              this.$store.state.totalParam = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //点击列表对应行，获取相关数据id
    chooseInfo(n) {
      this.commonId = n.id;
    },

    beforeAddFn() {
      for (let item in this.ruleForm) {
        this.ruleForm[item] = "";
      }
      // this.ruleForm.edit = "可以";
      this.$store.state.systemParamSign = true;
    },
    addFn() {
      if (
        this.checkParamFn(this.ruleForm.value, this.ruleForm.regularExpression)
      ) {
        this.$message.warning("参数值与参数值规则不匹配，请修改后再提交");
      } else {
        this.ruleForm.edit = this.ruleForm.edit == "可以" ? "1" : "0";
        this.$axios({
          method: "post",
          url: this.apiAdd,
          data: this.ruleForm
        }).then(res => {
          // console.log("新增信息结果反馈，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.systemParamSign = false;
            this.$store.state.pageNumParam = 1;
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    beforeEditFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiGetEditInfo + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("获取编辑信息接口返回数据，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm = res.data.value;
            if (this.ruleForm.edit == 0) {
              this.$message.warning("此参数信息不可被编辑");
            } else {
              this.ruleForm.edit =
                res.data.value.edit == "0" ? "不可以" : "可以";
              this.$store.state.systemParamSign = true;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    editFn() {
      if (
        this.checkParamFn(this.ruleForm.value, this.ruleForm.regularExpression)
      ) {
        this.$message.warning("参数值与参数值规则不匹配，请修改后再提交");
      } else {
        this.ruleForm.edit = this.ruleForm.edit == "可以" ? "1" : "0";
        this.$axios({
          method: "post",
          url: this.apiEdit,
          data: this.ruleForm
        }).then(res => {
          // console.log("提交编辑信息返回数据，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.systemParamSign = false;
            // this.$store.state.pageNumParam = 1;
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    checkParamFn(value, regularExpression) {
      var regex = new RegExp(regularExpression);
      // 参数值不符合正则表达式
      return !regex.test(value);
    },

    sureRedisFn() {
      this.$axios({
        method: "get",
        url: this.apiRedis,
        data: {}
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.$message.success("同步成功");
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!');
          // this.$store.state.systemParamSign = false
          if (this.$store.state.titleHeader === "新增") {
            // alert('触发了')
            this.addFn();
          } else if (this.$store.state.titleHeader === "编辑") {
            this.editFn();
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.$store.state.systemParamSign = false;
    }
  }
};
</script>

<style scoped>
</style>
