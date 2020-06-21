<template>
  <div class="area_page">
    <div class="tree_box">
      <treeviewComponent :data="data" @chooseAreaGetListInfo="chooseAreaGetListInfo"></treeviewComponent>
    </div>
    <div class="right_box">
      <mySearchs
        :addBtn="addBtn"
        :editBtn="editBtn"
        :enabledBtn="enabledBtn"
        :disabledBtn="disabledBtn"
        :showSearchBtn="showSearchBtn"
        @enabledFn="enabledFn"
        @disabledFn="disabledFn"
        @beforeAddFn="beforeAddFn"
        @beforeEditFn="beforeEditFn"
        class="my_searchs"
      ></mySearchs>
      <myTables
        :tableTitle="tableTitle"
        :tableData="tableData"
        @chooseInfo="chooseInfo"
        class="my_tables"
      ></myTables>
      <div id="addEditorForm">
        <el-dialog
          :title="$store.state.titleHeader"
          :visible.sync="$store.state.areaManageSign"
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
              <el-col :span="20" :offset="2">
                <el-form-item label="上级区域" prop="parentName">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.parentName" disabled></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="区域名称" prop="name">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.name"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="标准区域码" prop="code">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.code"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="区域级别" prop="level">
                  <el-col class="select_style">
                    <el-select v-model="ruleForm.level" placeholder="请选择区域级别" class="select_style1">
                      <el-option label="国家" :value="0"></el-option>
                      <el-option label="省、自治区" :value="1"></el-option>
                      <el-option label="市" :value="2"></el-option>
                      <el-option label="区、县" :value="3"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="国际电话区码">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.phoneCode"></el-input>
                  </el-col>
                  <el-col :span="1">
                    <el-popover placement="right-start" width="250" trigger="hover">
                      <span>当区域级别选为</span>
                      <span style="color:red;font-size:16px">
                        <b>国家</b>
                      </span>
                      <span>时,该参数必填</span>
                      <i class="el-icon-info" slot="reference"></i>
                    </el-popover>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="经纬度" prop="lonLat">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.lonLat"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="首字母" prop="initial">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.initial"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="简拼" prop="simpleSpell">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.simpleSpell"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item label="全拼" prop="fullSpell">
                  <el-col :span="20">
                    <el-input v-model="ruleForm.fullSpell"></el-input>
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
  </div>
</template>

<script>
export default {
  name: "areaManage",
  data() {
    // 自定义经纬度规则
    var checkLonLat = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入标准区域经纬度"));
      }
      var arr = value.split(",");
      if (arr.length == 1) {
        callback(new Error("请输入正确的标准区域经纬度"));
      } else {
        var lon = arr[0];
        var lat = arr[1];
        if (
          parseFloat(lon).toString() == "NaN" ||
          parseFloat(lon) < parseFloat(0) ||
          parseFloat(lon) > parseFloat(180)
        ) {
          callback(new Error("请输入正确的标准区域经度"));
        }
        if (
          parseFloat(lat).toString() == "NaN" ||
          parseFloat(lat) < parseFloat(0) ||
          parseFloat(lat) > parseFloat(90)
        ) {
          callback(new Error("请输入正确的标准区域纬度"));
        }
      }
      callback();
    };
    return {
      apiQuery: "/videomis/area/query",
      apiAreaTree: "/videomis/area/tree",
      apiAdd: "/videomis/area/add",
      apiGetEditInfo: "/videomis/area/get",
      apiEdit: "/videomis/area/edit",
      apiEnabled: "/videomis/area/enable",
      apiDisabled: "/videomis/area/disable",
      sign: "areamanage",
      commonId: "", //此参数是要执行对应操作按钮事件之前先通过表格列点击事件获取到信息，然后供后续操作使用
      addBtn: true,
      editBtn: true,
      enabledBtn: true,
      disabledBtn: true,
      showSearchBtn: true,
      areaStatus: "",
      data: [],
      tableTitle: [
        {
          prop: "name",
          label: "区域名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "code",
          label: "标准区域码",
          // width: '100',
          align: "center"
        },
        {
          prop: "phoneCode",
          label: "国际电话区码",
          // width: '100',
          align: "center"
        },
        {
          prop: "level",
          label: "级别",
          // width: '100',
          align: "center",
          formatter: function(row) {
            if (row.level == "0") {
              return "国家";
            } else if (row.level == "1") {
              return "省、自治区";
            } else if (row.level == "2") {
              return "市";
            } else if (row.level == "3") {
              return "区、县";
            }
          }
        },
        {
          prop: "lonLat",
          label: "经纬度",
          // width: '100',
          align: "center"
        },
        {
          prop: "parentName",
          label: "父级区域",
          // width: '100',
          align: "center"
        },
        {
          prop: "fullName",
          label: "区域全名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "simpleSpell",
          label: "简拼",
          // width: '100',
          align: "center"
        },
        {
          prop: "fullSpell",
          label: "全拼",
          // width: '100',
          align: "center"
        }
      ],
      tableData: [],
      ruleForm: {
        parentId: "",
        parentName: "",
        level: "",
        code: "",
        phoneCode: "",
        name: "",
        initial: "",
        simpleSpell: "",
        fullSpell: "",
        lonLat: ""
      },
      treeParentId: "",
      treeParentName: "",
      treeParantLevel: "",
      // 验证规则
      rules: {
        parentName: [{ required: true, message: "请选择父级区域" }],
        level: [
          { required: true, message: "请选择区域级别", trigger: "change" }
        ],
        code: [
          { required: true, message: "请输入标准区域码", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
        initial: [
          {
            required: true,
            message: "请输入区域拼音大写首字母",
            trigger: "blur"
          }
        ],
        simpleSpell: [
          { required: true, message: "请输入区域名称简拼", trigger: "blur" }
        ],
        fullSpell: [
          { required: true, message: "请输入区域名称全拼", trigger: "blur" }
        ],
        lonLat: [{ required: true, validator: checkLonLat, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfo();
    this.getDefaultAreaTree();
  },
  methods: {
    //选择左边区域树对应节点后，将选择的对应值ID赋值给，parentId，用于查询此parentId下对应的列表
    chooseAreaGetListInfo(n) {
      // console.log("选择树结构，传值过来++", n);
      //判断目前的父级区域ID和选中的区域ID是否一致，防止多次查询相同的信息
      if (this.ruleForm.parentId != n.id) {
        this.ruleForm.parentId = n.id;
        this.ruleForm.parentName = n.name;
        // 选中的左侧区域树的ID、Name和level
        this.treeParentId = n.id;
        this.treeParentName = n.name;
        this.treeParantLevel = n.level;
        this.getDefaultInfo();
      }
    },

    //获取默认列表信息方法
    getDefaultInfo() {
      var that = this;
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          areaId: this.ruleForm.parentId,
          pageNum: 1,
          pageSize: this.$store.state.pageSizeParam
        }
      })
        .then(res => {
          // console.log("区域管理返回的数据列表信息返回的数据", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            that.$store.state.totalParam = res.data.value.total;
            // console.log('返回的数据', that.$store.state.totalParam)
            this.tableData = [...res.data.value.list];
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },

    //获取默认区域树信息
    getDefaultAreaTree() {
      this.$axios({
        method: "get",
        url: this.apiAreaTree,
        data: {}
      })
        .then(res => {
          // console.log("区域树返回了哪些信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // console.log('区域树返回了哪些信息',res.data)
            this.data = [...res.data.value];
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //选择选中行数据进行赋值
    chooseInfo(n) {
      this.commonId = n.id;
      this.areaStatus = n.status;
    },

    beforeAddFn() {
      if (this.treeParentId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请在左侧区域树中选择一个父级区域");
        }
      } else {
        for (let item in this.ruleForm) {
          this.ruleForm[item] = "";
        }
        this.ruleForm.parentId = this.treeParentId;
        this.ruleForm.parentName = this.treeParentName;
        this.$store.state.areaManageSign = true;
      }
    },

    //新增信息
    addFn() {
      // console.log("开始提交新增信息");
      if (this.ruleForm.level <= this.treeParantLevel) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("区域级别选择有误,请重新选择");
        }
      } else if (this.ruleForm.level == 0 && this.ruleForm.phoneCode == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("区域级别选择为国家时,国际电话区码不能为空");
        }
      } else {
        this.ruleForm.initial = this.ruleForm.initial.toUpperCase();
        this.ruleForm.simpleSpell = this.ruleForm.simpleSpell.toUpperCase();
        this.ruleForm.fullSpell = this.ruleForm.fullSpell.toUpperCase();
        this.$axios({
          method: "post",
          url: this.apiAdd,
          data: this.ruleForm
        })
          .then(res => {
            // console.log("新增接口成功返回数据", res.data);
            if (res.data.resultStatus.resultCode === "0000") {
              this.$store.state.areaManageSign = false;
              this.getDefaultInfo();
              this.getDefaultAreaTree();
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          })
          .catch(error => {
            // console.log(error);
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
        })
          .then(res => {
            if (res.data.resultStatus.resultCode === "0000") {
              //   var nameParam = this.ruleForm.parentName;
              this.ruleForm = res.data.value;
              this.treeParantLevel = res.data.value.parentLevel;
              this.$store.state.areaManageSign = true;
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          })
          .catch(error => {});
      }
    },

    //编辑信息之后提交信息
    editFn() {
      // console.log("开始提交编辑信息");
      if (this.ruleForm.level <= this.treeParantLevel) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("区域级别选择有误,请重新选择");
        }
      } else if (this.ruleForm.level == 0 && this.ruleForm.phoneCode == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("区域级别选择为国家时,国际电话区码不能为空");
        }
      } else {
        this.ruleForm.initial = this.ruleForm.initial.toUpperCase();
        this.ruleForm.simpleSpell = this.ruleForm.simpleSpell.toUpperCase();
        this.ruleForm.fullSpell = this.ruleForm.fullSpell.toUpperCase();
        this.$axios({
          method: "post",
          url: this.apiEdit,
          data: this.ruleForm
        })
          .then(res => {
            // console.log("编辑接口成功返回数据", res.data);
            if (res.data.resultStatus.resultCode === "0000") {
              this.$store.state.areaManageSign = false;
              this.commonId = "";
              this.getDefaultInfo();
              this.getDefaultAreaTree();
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          })
          .catch(error => {});
      }
    },

    //启用
    enabledFn() {
      // alert('你选择了继续操作哦')
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.areaStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此区域已被启用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiEnabled + "?id=" + this.commonId,
          data: {}
        })
          .then(res => {
            if (res.data.resultStatus.resultCode === "0000") {
              // this.$store.state.pageNumParam = 1;
              this.commonId = "";
              this.getDefaultInfo();
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }

            // console.log(res.data,'前面是后台返回的启用之后的信息')
          })
          .catch(error => {});
      }
    },
    //禁用
    disabledFn() {
      // alert('你选择了继续操作哦')
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.areaStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此区域已被禁用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiDisabled + "?id=" + this.commonId,
          data: {}
        })
          .then(res => {
            if (res.data.resultStatus.resultCode === "0000") {
              // this.$store.state.pageNumParam = 1;
              this.commonId = "";
              this.getDefaultInfo();
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          })
          .catch(error => {});
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$store.state.titleHeader === "新增") {
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
    // 关闭窗口
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.$store.state.areaManageSign = false;
    }
  }
};
</script>

<style scoped>
.area_page {
  /*border: 1px solid red;*/
  display: flex;
  flex-direction: row;
  height: 8rem;
  min-height: 400px;
}

.tree_box,
.right_box {
  /*border: 1px solid green;*/
}

.tree_box {
  width: 20%;
}

.right_box {
  flex-grow: 1;
}
</style>
