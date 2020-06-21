<template>
  <div class="menu_page">
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
        @queryInfoFn="queryInfoFn"
        @chooseInfo="chooseInfo"
        class="my_tables"
      ></myTables>
      <div id="addEditorForm">
        <!-- 表单 -->
        <el-dialog
          :title="$store.state.titleHeader"
          :visible.sync="$store.state.menuManageSign"
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
                <el-form-item label="父菜单" prop="parentName">
                  <el-col>
                    <el-input v-model="ruleForm.parentName" disabled></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="18" :offset="2">
                <el-form-item label="菜单类型" prop="type">
                  <el-col class="select_style">
                    <el-select v-model="ruleForm.type" placeholder="请选择菜单类型" class="select_style1">
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
              <el-col :span="18" :offset="2">
                <el-form-item label="HTTP方法" prop="method">
                  <el-col class="select_style">
                    <el-select
                      v-model="ruleForm.method"
                      placeholder="请选择HTTP方法"
                      class="select_style1"
                    >
                      <el-option
                        v-for="item in methodArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="18" :offset="2">
                <el-form-item label="中文名称" prop="name">
                  <el-col>
                    <el-input v-model.trim="ruleForm.name"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="18" :offset="2">
                <el-form-item label="英文名称" prop="nameEn">
                  <el-col>
                    <el-input v-model.trim="ruleForm.nameEn"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="18" :offset="2">
                <el-form-item label="URL" prop="url">
                  <el-col>
                    <el-input v-model.trim="ruleForm.url"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <!-- 图标样式后台数据又该字段，但是目前还不支持该功能，先注释掉 -->
              <!-- <el-col :span="18" :offset="2">
                <el-form-item label="图标样式">
                  <el-col>
                    <el-input v-model="ruleForm.iconStyle" disabled></el-input>
                  </el-col>
                </el-form-item>
              </el-col>-->
              <el-col :span="18" :offset="2">
                <el-form-item label="显示顺序" prop="sort">
                  <el-col>
                    <el-input v-model.number="ruleForm.sort"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="18" :offset="2">
                <el-form-item label="可否刷新" prop="refreshable">
                  <el-radio-group v-model="ruleForm.refreshable">
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
                      maxlength="50"
                      show-word-limit
                      :autosize="{minRows:4,maxRows:6}"
                      v-model="ruleForm.description"
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
  </div>
</template>

<script>
export default {
  name: "menu-manage",
  data() {
    return {
      apiQuery: "/videomis/menu/queryByParent",
      apiMenuTree: "/videomis/menu/tree",
      apiAdd: "/videomis/menu/add",
      apiGetEditInfo: "/videomis/menu/get",
      apiEdit: "/videomis/menu/edit",
      apiEnabled: "/videomis/menu/enable",
      apiDisabled: "/videomis/menu/disable",
      sign: "menumanage",
      commonId: "", //此参数是要执行对应操作按钮事件之前先通过表格列点击事件获取到信息，然后供后续操作使用
      addBtn: true,
      editBtn: true,
      enabledBtn: true,
      disabledBtn: true,
      showSearchBtn: true,
      menuStatus: "",
      data: [],
      tableTitle: [
        // {
        //   prop: 'sex',
        //   label: '性别',
        //   width: '100',
        //   align: 'center',
        //   formatter: function (row) {
        //     return row.sex == '1' ? '男' : '女'
        //   }
        // },
        {
          prop: "name",
          label: "名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "no",
          label: "编号",
          // width: '180',
          align: "center"
        },
        {
          prop: "url",
          label: "URL",
          // width: '100',
          align: "center"
        },
        {
          prop: "iconStyle",
          label: "图标样式",
          // width: '180',
          align: "center"
        },
        {
          prop: "sort",
          label: "显示顺序",
          // width: '180',
          align: "center"
        },
        {
          prop: "type",
          label: "类型",
          // width: '180',
          align: "center",
          // formatter: function(row) {
          //   if (row.type == "0") {
          //     return "菜单";
          //   } else if (row.type == "1") {
          //     return "按钮";
          //   } else if (row.type == "2") {
          //     return "资源";
          //   } else if (row.type == "3") {
          //     return "查询按钮";
          //   } else if (row.type == "4") {
          //     return "导出按钮";
          //   }
          // }
        },
        {
          prop: "method",
          label: "HTTP方法",
          // width: '180',
          align: "center",
          // formatter: function(row) {
          //   if (row.method == "0") {
          //     return "GET";
          //   } else if (row.method == "1") {
          //     return "POST";
          //   } else if (row.method == "2") {
          //     return "PUT";
          //   } else if (row.method == "3") {
          //     return "DELETE";
          //   }
          // }
        },
        {
          prop: "refreshable",
          label: "可刷新",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.refreshable == "0" ? "否" : "是";
          }
        },
        {
          prop: "description",
          label: "描述",
          // width: '180',
          align: "center"
        }
      ],
      tableData: [
        // {
        //   name: '花果山',
        //   num: '001',
        //   url: 'http://www.baidu',
        //   iconStyle:'icon样式',
        //   showOrder: 1,
        //   type:'菜单',
        //   http:'GET',
        //   isReload:'可刷新',
        //   discrible:'描述一',
        //   status: 1,
        // },
      ],

      ruleForm: {
        parentId: "",
        parentName: "",
        type: "",
        method: "",
        name: "",
        nameEn: "",
        url: "",
        iconStyle: "",
        sort: "",
        refreshable: "",
        description: ""
      },
      treeParentId: "",
      treeParentName: "",
      // 验证规则
      rules: {
        parentName: [{ required: true, message: "请选择父级菜单" }],
        type: [
          { required: true, message: "请选择菜单类型", trigger: "change" }
        ],
        method: [
          { required: true, message: "请选择菜单HTTP方法", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入菜单中文名称", trigger: "blur" }
        ],
        nameEn: [
          { required: true, message: "请输入菜单英文名称", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入菜单URL", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入菜单显示顺序" },
          { type: "number", message: "顺序值必须为数字值" }
        ],
        refreshable: [
          {
            required: true,
            message: "请选择此菜单信息是否可刷新",
            trigger: "change"
          }
        ]
      },
      typeArr: [
        {
          id: "1",
          name: "菜单",
          value: "0"
        },
        {
          id: "2",
          name: "按钮",
          value: "1"
        },
        {
          id: "3",
          name: "查询按钮",
          value: "2"
        },
        {
          id: "4",
          name: "导出按钮",
          value: "3"
        },
        {
          id: "5",
          name: "资源",
          value: "4"
        }
      ],
      methodArr: [
        {
          id: "0",
          name: "GET",
          value: "0"
        },
        {
          id: "1",
          name: "POST",
          value: "1"
        },
        {
          id: "2",
          name: "PUT",
          value: "2"
        },
        {
          id: "3",
          name: "DELETE",
          value: "3"
        }
      ]
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfo();
    this.getDefaultMenuTree();
  },
  methods: {
    //选择左边菜单树对应节点后，将选择的对应值ID赋值给，parentId，用于查询此parentId下对应的列表
    chooseAreaGetListInfo(n) {
      // console.log("选择树结构，传值过来++", n);
      //判断目前的父级菜单ID和选中的菜单ID是否一致，防止多次查询相同的信息
      if (this.ruleForm.parentId != n.id) {
        this.ruleForm.parentId = n.id;
        this.ruleForm.parentName = n.name;
        // 选中的左侧菜单树的ID与Name
        this.treeParentId = n.id;
        this.treeParentName = n.name;
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
          parentId: this.ruleForm.parentId,
          pageNum: 1,
          pageSize: this.$store.state.pageSizeParam
        }
      })
        .then(res => {
          // console.log("菜单管理返回的数据列表信息返回的数据", res.data);
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

    //获取默认菜单树信息
    getDefaultMenuTree() {
      this.$axios({
        method: "get",
        url: this.apiMenuTree,
        data: {
          parentId: "",
          status: ""
        }
      })
        .then(res => {
          // console.log("菜单树返回了哪些信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // console.log('菜单树返回了哪些信息',res.data)
            this.data = [...res.data.value];
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //查询按钮返回列表数据
    queryInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          parentId: this.ruleForm.parentId,
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam
        }
      })
        .then(res => {
          if (res.data.resultStatus.resultCode === "0000") {
            // console.log('返回的数据', res.data.value.list)
            this.tableData = [...res.data.value.list];
            this.$store.state.totalParam = res.data.value.total;
            // console.log('赋值的数据', this.tableData)
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },
    //选择选中行数据进行赋值
    chooseInfo(n) {
      this.commonId = n.id;
      this.menuStatus = n.status;
    },

    beforeAddFn() {
      if (this.treeParentId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请在左侧菜单树中选择一个父级菜单");
        }
      } else {
        // 清空ruleForm
        for (let item in this.ruleForm) {
          this.ruleForm[item] = "";
        }
        this.ruleForm.parentId = this.treeParentId;
        this.ruleForm.parentName = this.treeParentName;
        this.$store.state.menuManageSign = true;
      }
    },

    //新增信息
    addFn() {
      // console.log("开始提交新增信息");
      this.ruleForm.refreshable =
        this.ruleForm.refreshable == "可以" ? "1" : "0";

        console.log(this.ruleForm)
     

      // if (this.ruleForm.type == "菜单") {
      //   this.ruleForm.type = "0";
      // } else if (this.ruleForm.type == "按钮") {
      //   this.ruleForm.type = "1";
      // } else if (this.ruleForm.type == "资源") {
      //   this.ruleForm.type = "2";
      // } else if (this.ruleForm.type == "查询按钮") {
      //   this.ruleForm.type = "3";
      // } else if (this.ruleForm.type == "导出按钮") {
      //   this.ruleForm.type = "4";
      // }

      // if (this.ruleForm.method == "GET") {
      //   this.ruleForm.method = "0";
      // } else if (this.ruleForm.method == "POST") {
      //   this.ruleForm.method = "1";
      // } else if (this.ruleForm.method == "PUT") {
      //   this.ruleForm.method = "2";
      // } else if (this.ruleForm.method == "DELETE") {
      //   this.ruleForm.method = "3";
      // }
  
      this.$axios({
        method: "post",
        url: this.apiAdd,
        data: this.ruleForm
      })
        .then(res => {
          // console.log("新增接口成功返回数据", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.menuManageSign = false;
            this.getDefaultInfo();
            this.getDefaultMenuTree();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {
          // console.log(error);
        });
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
            console.log("菜单管理点击获取的是什么信息", res.data.value);
            if (res.data.resultStatus.resultCode === "0000") {
              var nameParam = this.ruleForm.parentName;
              this.ruleForm = res.data.value;
              if (this.ruleForm.parentId == "1") {
                this.ruleForm.parentName = "系统根";
              } else {
                this.ruleForm.parentName = nameParam;
              }
              this.ruleForm.refreshable =
                this.ruleForm.refreshable == "0" ? "不可以" : "可以";
              
              const typeList = {
                "0":"菜单",
                "1":"按钮",
                "2":"资源",
                "3":"查询按钮",
                "4":"导出按钮"
              }
              
              const methodList = {
                "0":'GET',
                "1":"POST",
                "2":"PUT",
                "3":"DELETE"
              }
              // 展示数据
              this.ruleForm.type = typeList[this.ruleForm.type]
              this.ruleForm.method = methodList[this.ruleForm.method]

              this.$store.state.menuManageSign = true;
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
      this.ruleForm.refreshable =
        this.ruleForm.refreshable == "可以" ? "1" : "0";

      // 将数据改变回可发送请求的数据
      const typeList = {
       "菜单":"0",
       "按钮":"1",
       "资源":"2",
       "查询按钮":"3",
       "导出按钮":"4"
      }
              
      const methodList = {
          'GET':"0",
          "POST":"1",
          "PUT":"2",
          "DELETE":"3"
      }
      this.ruleForm.type = typeList[this.ruleForm.type]  ||  this.ruleForm.type 
      this.ruleForm.method = methodList[this.ruleForm.method] ||  this.ruleForm.method 
      console.log(this.ruleForm)
      this.$axios({
        method: "post",
        url: this.apiEdit,
        data: this.ruleForm
      })
        .then(res => {
          console.log("编辑接口成功返回数据", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.menuManageSign = false;
            this.commonId = "";
            this.getDefaultInfo();
            this.getDefaultMenuTree();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //启用
    enabledFn() {
      // alert('你选择了继续操作哦')
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.menuStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此菜单已被启用，无需操作");
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
      } else if (this.menuStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此菜单已被禁用，无需操作");
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
          // alert('submit!');
          // this.$store.state.menuManageSign = false
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
    // 关闭窗口
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.$store.state.menuManageSign = false;
    }
  }
};
</script>

<style scoped>
.menu_page {
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
