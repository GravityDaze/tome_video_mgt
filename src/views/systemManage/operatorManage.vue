<template>
  <div>
    <mySearchs
      :isLoginName="isLoginName"
      :isPhoneNum="isPhoneNum"
      :isState="isState"
      :addBtn="addBtn"
      :editBtn="editBtn"
      :enabledBtn="enabledBtn"
      :disabledBtn="disabledBtn"
      :abandonBtn="abandonBtn"
      :impowerBtn="impowerBtn"
      :resetPsdBtn="resetPsdBtn"
      @beforeAddFn="beforeAddFn"
      @beforeEditFn="beforeEditFn"
      @queryInfoFn="queryInfoFn"
      @enabledFn="enabledFn"
      @disabledFn="disabledFn"
      @abandonFn="abandonFn"
      @resetPsdFn="resetPsdFn"
      @getImpowerInfoFn="getImpowerInfoFn"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :tableTitle="tableTitle"
      :tableData="tableData"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>

    <!--第一个是操作员管理的新增编辑模态框-->
    <div id="addEditorForm">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.operatorManageSign"
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
            <el-col class="position_center">
              <div class="my_headpic">
                <div
                  class="upload_header"
                  :style="{backgroundImage:'url('+headerUrl+')',backgroundSize:'100% 100%'}"
                >
                  <input class="my_hover my_inputt" type="file" @change="chooseHeaderPicture" />
                </div>
                <!--<input class="upload_input my_hover" type="file" @change="chooseHeaderPicture">-->
              </div>
            </el-col>
            <!--<el-col class="position_center">-->
            <!--<span class="upload_btn my_hover">上传头像</span>-->
            <!--</el-col>-->
            <el-col class="position_center">
              <span class="tip_info">{{tipInfo}}</span>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="登录名" prop="name">
                <el-col>
                  <el-input v-model.trim="ruleForm.name" v-if="$store.state.titleHeader == '新增'"></el-input>
                  <el-input
                    v-model.trim="ruleForm.name"
                    v-if="$store.state.titleHeader == '编辑'"
                    :disabled="true"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="真实姓名" prop="realName">
                <el-col>
                  <el-input v-model.trim="ruleForm.realName"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="性别">
                <el-radio-group v-model="ruleForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="联系电话" prop="phone">
                <el-col>
                  <el-input v-model.number="ruleForm.phone"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="生日">
                <el-col>
                  <el-input v-model.trim="ruleForm.birthday" placeholder="2018-9-20"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="E-MAIL">
                <el-col>
                  <el-input v-model.trim="ruleForm.email"></el-input>
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

    <!--第二个是授权模态框-->
    <div id="userInfoForm">
      <el-dialog
        title="授权"
        :visible.sync="$store.state.operatorImpowerSign"
        width="35%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleFormOperatorImpower"
          ref="ruleFormOperatorImpower"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="操作员">
                <el-col>
                  <!--<el-input v-model="ruleFormOperatorImpower.operatorMan"></el-input>-->
                  <span style="color: red">{{ruleFormOperatorImpower.name}}</span>
                  <!--<span>{{ruleFormOperatorImpower.realName}}</span>-->
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="已有角色">
                <el-col>
                  <!--<el-checkbox-group v-model="ruleFormOperatorImpower.ownRole">-->

                  <!--<template v-for="item in roleArr">-->
                  <!--<el-checkbox :label="item.name"></el-checkbox>-->
                  <!--</template>-->
                  <!--</el-checkbox-group>-->
                  <span v-for="item in roleArr" :key="item.name">
                    <el-button type="success" style="margin: 0 5px;">{{item.name}}</el-button>
                  </span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="可授角色">
                <el-col>
                  <el-checkbox-group v-model="ruleFormOperatorImpower.ImpowerRole">
                    <!--<el-checkbox label="ADMIN"></el-checkbox>-->
                    <!--<el-checkbox label="技术支撑"></el-checkbox>-->
                    <!--<el-checkbox label="片区管理员"></el-checkbox>-->
                    <!--<el-checkbox label="景区管理员"></el-checkbox>-->

                    <template v-for="item in canChooseRoleArr">
                      <el-checkbox :label="item.name" :key="item.name"></el-checkbox>
                    </template>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleFormOperatorImpower')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleFormOperatorImpower')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
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
      apiQuery: "/videomis/user/query",
      apiAdd: "/videomis/user/add",
      apiGetEditInfo: "/videomis/user/get",
      apiEdit: "/videomis/user/edit",
      apiEnabled: "/videomis/user/enable",
      apiDisabled: "/videomis/user/disable",
      apiAbandon: "/videomis/user/close",
      apiUploadImage: "/mis/upload/uploadImage",
      apiResetPsd: "/videomis/user/resetPw",
      apiGetImpowerInfo: "/videomis/user/getAuth",
      apiImpower: "/videomis/user/auth",
      sign: "operatormanage",
      isLoginName: true,
      isPhoneNum: true,
      isState: true,
      addBtn: true,
      editBtn: true,
      enabledBtn: true,
      disabledBtn: true,
      abandonBtn: true,
      impowerBtn: true,
      resetPsdBtn: true,
      tipInfo: "头像推荐尺寸为 280(宽) * 280(高)，大小不超过 500KB.",
      commonId: "",
      headerUrl: "../../../static/addIcon.png",
      operatorStatus: "",
      ruleForm: {
        //个人信息参数
        realName: "", //真实姓名
        name: "", //登录名
        phone: "", //联系电话
        sex: "", //性别
        email: "", //电子邮箱
        birthday: "", //出生日期
        headPicPath: "" //头像url
      },
      // 验证规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入操作员登录名不能为空",
            tigger: "blur"
          }
        ],
        realName: [
          { required: true, message: "请输入操作员真实姓名", tigger: "blur" }
        ],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }]
      },
      tableTitle: [
        {
          prop: "name",
          label: "登录名",
          // width: '100',
          align: "center"
        },
        {
          prop: "realName",
          label: "真实姓名",
          // width: '180',
          align: "center"
        },
        {
          prop: "phone",
          label: "联系电话",
          // width: '100',
          align: "center"
        },
        {
          prop: "sex",
          label: "性别",
          // width: '180',
          align: "center",
          formatter: function(row) {
            if (row.sex == "1") {
              return "男";
            } else if (row.sex == "2") {
              return "女";
            }
          }
        },
        {
          prop: "email",
          label: "E-MAIL",
          // width: '180',
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "创建时间",
          // width: '180',
          align: "center"
        },
        {
          prop: "loginDatetime",
          label: "最后登录时间",
          // width: '180',
          align: "center"
        },
        {
          prop: "editPassDatetime",
          label: "最后修改时间",
          // width: '180',
          align: "center"
        }
      ],
      tableData: [],

      ruleFormOperatorImpower: {
        name: "",
        realName: "",
        ownRole: [],
        ImpowerRole: []
      },
      //已有角色数组
      roleArr: [],

      //可以选择角色的数组
      canChooseRoleArr: []
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
          phone: "",
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
          name: this.$store.state.loginNameParam,
          phone: this.$store.state.phoneParam,
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
        .catch(error => {});
    },

    chooseInfo(n) {
      this.commonId = n.id;
      this.ruleFormOperatorImpower.name = n.name;
      this.ruleFormOperatorImpower.realName = n.realName;
      this.operatorStatus = n.status;
    },

    enabledFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.operatorStatus == 9) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此用户已被弃用，为最终状态，无法被更改");
        }
      } else if (this.operatorStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此用户已被启用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiEnabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("启用返回信息，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
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
      } else if (this.operatorStatus == 9) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此用户已被弃用，为最终状态，无法被更改");
        }
      } else if (this.operatorStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此用户已被禁用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiDisabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("禁用返回的数据信息，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam = 1;
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    abandonFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.operatorStatus == 9) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此用户已被弃用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiAbandon + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("弃用返回的数据，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam = 1;
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //上传图
    chooseHeaderPicture(e) {
      this.ruleForm.headPicPath = e.target.files[0];
      var formdata = new FormData();
      formdata.append("file", this.ruleForm.headPicPath);
      this.$axios({
        method: "post",
        url: this.apiUploadImage,
        data: formdata
      })
        .then(res => {
          // console.log("景区图层管理上传图片返回了什么", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm.headPicPath = res.data.value.url;
            this.headerUrl = res.data.value.url;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    beforeAddFn() {
      for (let item in this.ruleForm) {
        this.ruleForm[item] = "";
      }

      this.headerUrl = "../../../static/addIcon.png";
      this.$store.state.operatorManageSign = true;
    },

    addFn() {
      this.ruleForm.sex = this.ruleForm.sex == "男" ? "1" : "2";

      this.$axios({
        method: "post",
        url: this.apiAdd,
        data: this.ruleForm
      }).then(res => {
        // console.log("新增返回数据", res.data);
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.operatorManageSign = false;
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
          // console.log("编辑前获取相关数据，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm = res.data.value;
            this.ruleForm.sex = res.data.value.sex == "1" ? "男" : "女";
            this.ruleForm.headPicPath = res.data.value.headPicPath;
            this.headerUrl = res.data.value.headPicPath;

            this.$store.state.operatorManageSign = true;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    editFn() {
      this.ruleForm.sex = this.ruleForm.sex == "男" ? "1" : "2";
      this.$axios({
        method: "post",
        url: this.apiEdit,
        data: this.ruleForm
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.operatorManageSign = false;
          // this.$store.state.pageNumParam = 1;
          this.commonId = "";
          this.getDefaultInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    checkOwerFn(arr, obj) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == obj) {
          return ture;
        }
      }
    },

    //授权操作(获取已经有哪些权利角色，和有哪些角色可以选择授权)
    getImpowerInfoFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.ruleFormOperatorImpower.ImpowerRole = [];
        this.$axios({
          method: "get",
          url: this.apiGetImpowerInfo + "?id=" + this.commonId,
          data: {}
        })
          .then(res => {
            // console.log("默认获取对应授权角色信息返回数据，", res.data);
            if (res.data.resultStatus.resultCode === "0000") {
              this.roleArr = [...res.data.value.beAuth];
              this.canChooseRoleArr = [...res.data.value.canAuth];
              this.$store.state.operatorImpowerSign = true;
              // console.log("有哪些角色可以授权：", res.data);
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          })
          .catch(error => {});
      }
    },

    //确认提交授权
    sureImpowerInfo() {
      // console.log("canChooseRoleArr:", this.canChooseRoleArr);
      var skt = [];
      // console.log("选了哪些+++++，", this.ruleFormOperatorImpower.ImpowerRole);
      let myChooseRole = this.ruleFormOperatorImpower.ImpowerRole;

      for (let s = 0; s < myChooseRole.length; s++) {
        for (let r = 0; r < this.canChooseRoleArr.length; r++) {
          // console.log(myChooseRole[s],'?????',this.canChooseRoleArr[r].name)
          if (myChooseRole[s] == this.canChooseRoleArr[r].name) {
            skt.push(this.canChooseRoleArr[r].id);
          }
        }
      }

      this.$axios({
        method: "post",
        url: this.apiImpower,
        data: {
          id: this.commonId,
          roleIds: skt
        }
      })
        .then(res => {
          // console.log("最终授权结果反馈：", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.operatorImpowerSign = false;
            // this.getDefaultInfo()
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    resetPsdFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiResetPsd + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("重置密码返回数据，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$message.success("重置密码成功");
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "ruleForm") {
            if (this.$store.state.titleHeader === "新增") {
              this.addFn();
            } else if (this.$store.state.titleHeader === "编辑") {
              this.editFn();
            }
          } else if (formName === "ruleFormOperatorImpower") {
            this.sureImpowerInfo();
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm(formName) {
      if (formName === "ruleForm") {
        this.$refs[formName].resetFields();
        this.$store.state.operatorManageSign = false;
      } else if (formName === "ruleFormOperatorImpower") {
        this.$store.state.operatorImpowerSign = false;
      }
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
