<template>
  <div>
    <mySearchs
      :sign="sign"
      :isTagName="isTagName"
      :isState="isState"
      :isTagType="isTagType"
      :addBtn="addBtn"
      :editBtn="editBtn"
      :enabledBtn="enabledBtn"
      :disabledBtn="disabledBtn"
      @beforeAddFn="beforeAddFn"
      @addFn="addFn"
      @beforeEditFn="beforeEditFn"
      @editFn="editFn"
      @queryInfoFn="queryInfoFn"
      @enabledFn="enabledFn"
      @disabledFn="disabledFn"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :sign="sign"
      :tableTitle="tableTitle"
      :tableData="tableData"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>

    <!--标签管理新增或者编辑-->
    <div id="publicAddEditorDialog">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.tagManageSign"
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
              <el-form-item label="标签名称" prop="name">
                <el-col>
                  <el-input v-model.trim="ruleForm.name" placeholder="请输入标签名称"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="标签类型" prop="type">
                <el-col class="select_style" v-if="$store.state.titleHeader=='新增'">
                  <el-select v-model.trim="ruleForm.type" placeholder="请选择类型" class="select_style1">
                    <el-option
                      v-for="item in typeArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col class="select_style" v-if="$store.state.titleHeader=='编辑'">
                  <el-select v-model.trim="ruleForm.type" placeholder="请选择类型" class="select_style1">
                    <el-option
                      v-for="item in typeArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
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
  name: "tag-manage",
  data() {
    return {
      apiQuery: "videomis/tags/query", //标签列表查询
      apiAdd: "videomis/tags/add", //标签新增
      apiGetInfo: "videomis/tags/get", //标签单个信息获取
      apiEdit: "videomis/tags/edit", //标签编辑
      apiEnabled: "videomis/tags/enable", //标签启用
      apiDisabled: "videomis/tags/disable", //标签禁用
      commonId: "", //选择当前数据行是，对应需要的id
      sign: "tagmanage",
      isTagName: true,
      isState: true,
      isTagType: true,
      addBtn: true,
      editBtn: true,
      enabledBtn: true,
      disabledBtn: true,
      tagStatus: "",
      tableTitle: [
        {
          prop: "name",
          label: "标签名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "type",
          label: "标签类型",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.type == "1" ? "景区标签" : "";
          }
        },
        {
          prop: "createDatetime",
          label: "创建时间",
          // width: '180',
          align: "center"
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          // width: '180',
          align: "center"
        }
      ],
      tableData: [],
      ruleForm: {
        name: "",
        type: ""
      },
      // 验证规则
      rules: {
        name: [{ required: true, message: "请输入标签名称", tigger: "blur" }],
        type: [{ required: true, message: "请选择标签类型", tigger: "blur" }]
      },
      typeArr: [
        {
          id: "0",
          name: "景区标签",
          value: "1"
        }
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
          name: "",
          type: "",
          status: ""
        }
      })
        .then(res => {
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
          name: this.$store.state.tagNameParam,
          type: this.$store.state.tagTypeParam,
          status: this.$store.state.stateParam
        }
      })
        .then(res => {
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
        .catch(error => {
          this.$message.warning("出错了");
        });
    },

    //获取当前点击行的相关信息
    chooseInfo(n) {
      this.commonId = n.id;
      this.tagStatus = n.status;
    },

    // 新增前清空数据方法
    beforeAddFn() {
      this.ruleForm.name = "";
      this.ruleForm.type = "";
      this.$store.state.tagManageSign = true;
    },

    //标签新增
    addFn() {
      this.$axios({
        method: "post",
        url: this.apiAdd,
        data: {
          name: this.ruleForm.name,
          type: this.ruleForm.type
        }
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.tagManageSign = false;
          this.getDefaultInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    //标签编辑前读取旧信息
    beforeEditFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiGetInfo + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm.name = res.data.value.name;
            this.ruleForm.type = res.data.value.type == "1" ? "景区标签" : "";
            this.$store.state.tagManageSign = true;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //标签编辑
    editFn() {
      if (isNaN(this.ruleForm.type)) {
        if (this.ruleForm.type == "景区标签") {
          this.ruleForm.type = "1";
        }
      }
      this.$axios({
        method: "post",
        url: this.apiEdit,
        data: {
          id: this.commonId,
          name: this.ruleForm.name,
          type: this.ruleForm.type
        }
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.tagManageSign = false;
          this.commonId = "";
          this.getDefaultInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    //提交方法（新增、编辑）
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$store.state.titleHeader === "新增") {
            this.addFn();
          } else if (this.$store.state.titleHeader === "编辑") {
            this.editFn();
          }
        } else {
          return false;
        }
      });
    },

    //关闭弹窗
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.$store.state.tagManageSign = false;
    },

    //启用标签
    enabledFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.tagStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此标签已被启用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiEnabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam = 1
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //禁用标签
    disabledFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.tagStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此标签已被禁用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiDisabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam = 1
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.lng_lat_outbox {
  /*border:1px solid red;*/
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.lng_lat_outbox > button {
  display: inline-block;
  width: 50%;
}
</style>
