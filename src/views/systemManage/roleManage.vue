<template>
  <div>
    <mySearchs
      :isRoleName="isRoleName"
      :isAuthorityFlag="isAuthorityFlag"
      :isState="isState"
      :addBtn="addBtn"
      :editBtn="editBtn"
      :enabledBtn="enabledBtn"
      :disabledBtn="disabledBtn"
      :roleImpowerBtn="roleImpowerBtn"
      :functionImpowerBtn="functionImpowerBtn"
      @queryInfoFn="queryInfoFn"
      @beforeAddFn="beforeAddFn"
      @beforeEditFn="beforeEditFn"
      @enabledFn="enabledFn"
      @disabledFn="disabledFn"
      @getChooseRoleInfos="getChooseRoleInfos"
      @getChooseFunctionInfos="getChooseFunctionInfos"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :tableTitle="tableTitle"
      :tableData="tableData"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>

    <!--第一个是角色新增编辑模态-->
    <div id="addEditorForm">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.roleManageSign"
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
              <el-form-item label="角色名" prop="name">
                <el-col>
                  <el-input v-model.trim="ruleForm.name"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="22" :offset="2">
              <el-form-item label="权限标识" prop="mark">
                <el-col :span="18">
                  <el-input placeholder="请输入标识" v-model.trim="ruleForm.mark">
                    <template slot="prepend">ROLE_</template>
                  </el-input>
                </el-col>
                <el-col :span="1">
                  <el-popover
                    placement="right-start"
                    title="角色必须以统一标识开头"
                    width="210"
                    trigger="hover"
                  >
                    <span style="color:red;font-size:16px">
                      <b>平台管理员：</b>
                    </span>
                    <span>ROLE_ADMIN_*</span>
                    <span style="color:red;font-size:16px">
                      <b>审核员：</b>
                    </span>
                    <span>ROLE_EXAMINE_*</span>
                    <i class="el-icon-info" slot="reference"></i>
                  </el-popover>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="显示顺序" prop="sort">
                <el-col>
                  <el-input v-model.number="ruleForm.sort"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="角色描述">
                <el-col>
                  <el-input
                    type="textarea"
                    maxlength="30"
                    show-word-limit
                    :autosize="{minRows:3,maxRows:6}"
                    v-model="ruleForm.description"
                  ></el-input>
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

    <!--第二个是角色授权模态框-->
    <div id="userInfoForm">
      <el-dialog
        title="角色授权"
        :visible.sync="$store.state.roleImpowerSign"
        width="25%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleFormRoleImpower"
          ref="ruleFormRoleImpower"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="角色名">
                <el-col>
                  <!--<el-input v-model="ruleFormRoleImpower.roleName"></el-input>-->
                  <span>{{ruleFormRoleImpower.name}}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="可授角色">
                <el-col>
                  <el-checkbox-group v-model="ruleFormRoleImpower.ImpowerRole">
                    <template v-for="item in canChooseRoleArr">
                      <el-checkbox
                        :key="item.name"
                        :label="item.name"
                        style="min-width:150px;width:1.5rem"
                      ></el-checkbox>
                    </template>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleFormRoleImpower')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleFormRoleImpower')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!--第三个是功能授权模态框-->
    <div id="sceneryAllInfo">
      <el-dialog
        title="功能授权"
        :visible.sync="$store.state.roleFunctionImpowerSign"
        width="25%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleFormRoleFunctionImpower"
          ref="ruleFormRoleFunctionImpower"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="角色名">
                <el-col>
                  <!--<el-input v-model="ruleFormRoleImpower.roleName"></el-input>-->
                  <span>{{ruleFormRoleImpower.name}}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="功能权限">
                <el-col>
                  <!--<el-tree-->
                  <!--:data="dataTree"-->
                  <!--:props="defaultProps"-->
                  <!--node-key="id"-->
                  <!--:default-expanded-keys="[3]"-->
                  <!--@node-click="handleNodeClick"-->
                  <!--&gt;</el-tree>-->
                  <el-tree
                    :data="dataTree"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="[1]"
                    :default-checked-keys="impowerFunctionIdsShowArr"
                    :props="defaultProps"
                  ></el-tree>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-col :span="10" style="display: flex;flex-wrap: nowrap">
              <el-button @click="getCheckedKeys">确认勾选</el-button>
            </el-col>
            <el-col :span="10" :offset="2" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleFormRoleFunctionImpower')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleFormRoleFunctionImpower')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "role-manage",
  data() {
    return {
      apiQuery: "/videomis/role/query",
      apiAdd: "/videomis/role/add",
      apiGetEditInfo: "/videomis/role/get",
      apiEdit: "/videomis/role/edit",
      apiEnabled: "/videomis/role/enable",
      apiDisabled: "/videomis/role/disable",
      apiCanChooseRole: "/videomis/role/getAssignableAuth",
      apiSureImpowerRole: "/videomis/role/assignableAuth",
      apiCanChooseFunction: "/videomis/role/getMenuAuth",
      apiSureImpowerFunction: "/videomis/role/menuAuth",
      sign: "rolemanage",
      isRoleName: true,
      isAuthorityFlag: true,
      isState: true,
      addBtn: true,
      editBtn: true,
      enabledBtn: true,
      disabledBtn: true,
      roleImpowerBtn: true,
      functionImpowerBtn: true,
      commonId: "",
      roleStatus: "",
      ruleForm: {
        name: "",
        mark: "",
        sort: "",
        description: ""
      },
      // 验证规则
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        mark: [
          { required: true, message: "请输入此角色权限标识", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入菜单显示顺序" },
          { type: "number", message: "顺序值必须为数字值" }
        ]
      },
      ruleFormRoleImpower: {
        name: "xxx",
        ImpowerRole: []
      },
      //可以选择角色的数组
      canChooseRoleArr: [
        {
          description: "",
          id: "1",
          mark: "",
          name: "",
          sort: "",
          status: ""
        }
      ],

      ruleFormRoleFunctionImpower: {
        roleName: "xxx",
        ImpowerRole: []
      },
      impowerFunctionIdsShowArr: [],
      impowerFunctionIdsArr: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      flagParam: false, //此参数用于功能授权时，必须先点击确认勾选才可以提交，否则不能提交
      dataTree: [
        // {
        //   children: [
        //     {
        //       children: [],
        //       iconStyle: '',
        //       id: 2,
        //       method: 1,
        //       name: "首页",
        //       no: "M00002",
        //       parentId: 1,
        //       refreshable: 0,
        //       sort: 0,
        //       type: 0,
        //       url: "/home"
        //     }
        //   ],
        //   iconStyle: '',
        //   id: 1,
        //   method: 0,
        //   name: "系统根",
        //   no: "M00000",
        //   parentId: 0,
        //   refreshable: 0,
        //   sort: 0,
        //   type: 0,
        //   url: '',
        // }
      ],
      tableTitle: [
        {
          prop: "name",
          label: "角色名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "mark",
          label: "权限标识",
          // width: '180',
          align: "center"
        },
        {
          prop: "sort",
          label: "显示顺序",
          // width: '100',
          align: "center"
        },
        {
          prop: "description",
          label: "角色描述",
          // width: '180',
          align: "center"
        }
      ],
      tableData: []
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
          mark: "",
          status: ""
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
          name: this.$store.state.roleNameParam,
          mark: this.$store.state.authorityFlagParam,
          status: this.$store.state.stateParam
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

    chooseInfo(n) {
      this.commonId = n.id;
      this.ruleFormRoleImpower.name = n.name;
      this.ruleFormRoleFunctionImpower.roleName = n.name;
      this.roleStatus = n.status;
    },

    beforeAddFn() {
      for (let item in this.ruleForm) {
        this.ruleForm[item] = "";
      }
      this.$store.state.roleManageSign = true;
    },

    addFn() {
      this.$axios({
        method: "post",
        url: this.apiAdd,
        data: this.ruleForm
      }).then(res => {
        // console.log("新增结果返回", res.data);
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.roleManageSign = false;
          this.$store.state.pageNumParam = 1;
          this.getDefaultInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
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
        }).then(res => {
          // console.log("获取编辑前信息，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm = res.data.value;
            this.ruleForm.mark = this.ruleForm.mark.substring(5);
            this.$store.state.roleManageSign = true;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    editFn() {
      this.$axios({
        method: "post",
        url: this.apiEdit,
        data: this.ruleForm
      }).then(res => {
        // console.log("提交编辑信息返回数据，", res.data);
        if (res.data.resultStatus.resultCode === "0000") {
          this.commonId = "";
          this.$store.state.roleManageSign = false;
          // this.$store.state.pageNumParam = 1
          this.getDefaultInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    enabledFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.roleStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此角色已被启用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiEnabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log('启用事件返回信息，',res.data)
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$message.success("启用成功");
            // this.$store.state.pageNumParam = 1;
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    disabledFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.roleStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此角色已被禁用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiDisabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log('禁用事件返回信息，',res.data)
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$message.success("禁用成功");
            // this.$store.state.pageNumParam = 1;
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //角色授权的选择信息获取
    getChooseRoleInfos() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiCanChooseRole + "?id=" + this.commonId,
          data: {}
        })
          .then(res => {
            if (res.data.resultStatus.resultCode === "0000") {
              // console.log("获取角色授权选择信息数组", res.data);
              //以下赋值是将已经有的角色权利和可选的合并，方便选择之后上传完整的角色权利

              // this.canChooseRoleArr = [...res.data.value.canAuth, ...res.data.value.authed]
              // this.ruleFormRoleImpower.ImpowerRole = []

              this.canChooseRoleArr = [...res.data.value.canAuth];
              this.ruleFormRoleImpower.ImpowerRole = []; //此数组控制已选择框
              let midArr = [...res.data.value.beAuth];

              //hahah

              for (let i = 0; i < midArr.length; i++) {
                this.ruleFormRoleImpower.ImpowerRole.push(midArr[i].name);
              }

              this.$store.state.roleImpowerSign = true;
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          })
          .catch(error => {});
      }
    },

    //提交角色授权信息
    sureChooseRoleInfos() {
      // alert('注意了，注意了')
      // console.log(
      //   "选择了的++",
      //   this.ruleFormRoleImpower.ImpowerRole,
      //   "全部的++",
      //   this.canChooseRoleArr
      // );
      var ids = [];
      var arr1 = this.canChooseRoleArr;
      var arr2 = this.ruleFormRoleImpower.ImpowerRole;
      for (let i = 0; i < arr2.length; i++) {
        for (let t = 0; t < arr1.length; t++) {
          if (arr2[i] == arr1[t].name) {
            ids.push(arr1[t].id);
          }
        }
      }

      // console.log("ids:++++", ids);
      this.$axios({
        method: "post",
        url: this.apiSureImpowerRole,
        data: {
          id: this.commonId,
          roleIds: ids
        }
      })
        .then(res => {
          // console.log(res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.commonId = "";
            this.$store.state.roleImpowerSign = false;
            this.$message.success(res.data.resultStatus.resultMessage);
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {
          this.$message.warning(res.data.resultStatus.resultMessage);
        });
    },

    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!');
          if (formName === "ruleForm") {
            this.ruleForm.mark = "ROLE_" + this.ruleForm.mark;
            if (this.$store.state.titleHeader === "新增") {
              this.addFn();
            } else if (this.$store.state.titleHeader === "编辑") {
              this.editFn();
            }

            // this.$store.state.roleManageSign = false
          } else if (formName === "ruleFormRoleImpower") {
            this.sureChooseRoleInfos();
            // this.$store.state.roleImpowerSign = false
          } else if (formName === "ruleFormRoleFunctionImpower") {
            // this.$store.state.roleFunctionImpowerSign = false
            this.sureChooseFunctionInfos();
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
      if (formName === "ruleForm") {
        this.$store.state.roleManageSign = false;
      } else if (formName === "ruleFormRoleImpower") {
        this.$store.state.roleImpowerSign = false;
      } else if (formName === "ruleFormRoleFunctionImpower") {
        this.$store.state.roleFunctionImpowerSign = false;
      }
    },

    //获取树形结构所选中项ID号
    getCheckedKeys() {
      this.impowerFunctionIdsArr = [];

      // console.log(this.$refs.tree.getCheckedKeys());
      //以下参数用于传递数据给ids2，即用于功能授权上传id数组
      this.impowerFunctionIdsArr = [
        ...this.$refs.tree.getHalfCheckedKeys(),
        ...this.$refs.tree.getCheckedKeys()
      ];
      // var haha = [...this.$refs.tree.getHalfCheckedKeys()]

      this.impowerFunctionIdsArr.shift();
      this.flagParam = true;

      //解决对应bug

      // console.log("赋值是否成功：++", this.impowerFunctionIdsArr);
    },

    //功能授权的选择信息获取
    getChooseFunctionInfos() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiCanChooseFunction + "?id=" + this.commonId,
          data: {}
        })
          .then(res => {
            if (res.data.resultStatus.resultCode === "0000") {
              // console.log("LLL功能授权获取相关信息", res.data);
              this.dataTree = [...res.data.value.canAuth];
              this.impowerFunctionIdsShowArr = [];
              let midArr2 = [...res.data.value.beAuth];
              for (let t = 0; t < midArr2.length; t++) {
                this.impowerFunctionIdsShowArr.push(midArr2[t].id);
              }
              this.$store.state.roleFunctionImpowerSign = true;
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          })
          .catch(error => {});
      }
    },
    //提交功能授权信息
    sureChooseFunctionInfos() {
      if (!this.flagParam) {
        this.$message.warning("请先确认勾选，再提交数据");
        return;
      }
      var ids2 = [];
      ids2 = [...this.impowerFunctionIdsArr];
      // ids2 = [...this.impowerFunctionIdsShowArr]
      // console.log(ids2);
      this.$axios({
        method: "post",
        url: this.apiSureImpowerFunction,
        data: {
          id: this.commonId,
          menuIds: ids2
        }
      })
        .then(res => {
          // console.log(res.data)
          this.flagParam = false;
          if (res.data.resultStatus.resultCode === "0000") {
            this.commonId = "";
            this.$store.state.roleFunctionImpowerSign = false;
            this.$message.success(res.data.resultStatus.resultMessage);
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {
          this.$message.warning(res.data.resultStatus.resultMessage);
        });
    }
  }
};
</script>

<style scoped>
</style>
