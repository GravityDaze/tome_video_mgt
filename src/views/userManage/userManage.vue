<template>
  <div>
    <mySearchs
      :sign="sign"
      :isUserNickName="isUserNickName"
      :isUserOpenId="isUserOpenId"
      :isRegisterTime="isRegisterTime"
      :isState="isState"
      :enabledBtn="enabledBtn"
      :disabledBtn="disabledBtn"
      @queryInfoFn="queryInfoFn"
      @enabledFn="enabledFn"
      @disabledFn="disabledFn"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :sign="sign"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :isShowUserNum="isShowUserNum"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      @getDefaultInfoFn2="getDefaultInfoFn2"
      class="my_tables"
    ></myTables>

    <div id="myTablesDialog">
      <el-dialog
        title="用户详情"
        :visible.sync="$store.state.userInfo"
        width="70%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm2"
          ref="ruleForm2"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <div>
            <mySearchs
              :showSearchBtn="showSearchBtn"
              :userInfoBtn="userInfoBtn"
              :needInfoBtn="needInfoBtn"
            ></mySearchs>

            <div class="user_info_box" v-if="$store.state.cutParam == '1'">
              <el-row>
                <el-col :span="8" :offset="3">
                  <el-form-item label="头像">
                    <el-col>
                      <div
                        class="upload_header"
                        :style="{backgroundImage:'url('+ruleForm2.headUrl+')',backgroundSize:'100% 100%'}"
                      ></div>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="人脸采集">
                    <el-col>
                      <div
                        class="upload_header"
                        :style="{backgroundImage:'url('+ruleForm2.frontFace+')',backgroundSize:'100% 100%'}"
                      ></div>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="用户ID">
                    <el-col :offset="6">
                      <span>{{ruleForm2.id}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="用户编号">
                    <el-col :offset="6">
                      <span>{{ruleForm2.no}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="昵称">
                    <el-col :offset="6">
                      <span>{{ruleForm2.nickName}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="手机号">
                    <el-col :offset="6">
                      <span>{{ruleForm2.phone}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                  <el-form-item label="邮箱">
                    <el-col :offset="6">
                      <span>{{ruleForm2.email}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="性别">
                    <el-col :offset="6">
                      <span>{{ruleForm2.sex}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="真实名称">
                    <el-col :offset="6">
                      <span>{{ruleForm2.realName}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="身份证号">
                    <el-col :offset="6">
                      <span>{{ruleForm2.credentialsNumber}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="注册IP">
                    <el-col :offset="6">
                      <span>{{ruleForm2.registerIp}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="注册IMEI">
                    <el-col :offset="6">
                      <span>{{ruleForm2.imei}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="注册时间">
                    <el-col :offset="6">
                      <span>{{ruleForm2.createDatetime}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="更新时间">
                    <el-col :offset="6">
                      <span>{{ruleForm2.updateDatetime}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="最后登录">
                    <el-col :offset="6">
                      <span>{{ruleForm2.lastLoginDatetime}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="状态">
                    <el-col :offset="6">
                      <span>{{ruleForm2.status}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="openID">
                    <el-col :offset="6">
                      <span>{{ruleForm2.openId}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="需求总数">
                    <el-col :offset="6">
                      <span>{{ruleForm2.needCount}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="交易总金额">
                    <el-col :offset="6">
                      <span>{{ruleForm2.orderPrice}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-form-item label="交易总次数">
                    <el-col :offset="6">
                      <span>{{ruleForm2.orderCount}}</span>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <myTables
              :tableTitle="tableTitle2"
              :tableData="tableData2"
              :isShowEnabled="isShowEnabled"
              :showPagePlug1="showPagePlug1"
              @queryInfoFn2="queryInfoFn2"
              v-if="$store.state.cutParam == '2'"
            ></myTables>
          </div>
          <el-form-item>
            <el-col :span="6" :offset="18" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm2')">关闭</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-manage",
  data() {
    return {
      apiQuery: "/videomis/customer/query",
      apiEnabled: "/videomis/customer/enable",
      apiDisabled: "/videomis/customer/disable",
      apiQueryX: "/videomis/need/queryByCustomer",
      apiUserInfo: "/videomis/customer/get",
      sign: "usermanage",
      isUserNickName: true,
      isUserOpenId: false,
      isRegisterTime: true,
      isState: true,
      enabledBtn: true,
      disabledBtn: true,
      isShowEnabled: true,
      isShowUserNum: true,
      userInfoBtn: true,
      needInfoBtn: true,
      showSearchBtn: true,
      showPagePlug1: true,
      commonId: "", //获取对应行数据id是存储在这个参数里
      userStatus: "",
      tableTitle: [
        // {
        //   prop: 'openId',
        //   label: '用户openID',
        //   // width: '100',
        //   align: 'center'
        // },
        {
          prop: "nickName",
          label: "昵称",
          // width: '180',
          align: "center"
        },
        {
          prop: "sex",
          label: "性别",
          width: "100",
          align: "center",
          formatter: function(row) {
            return row.sex == "1" ? "男" : "女";
          }
        },
        {
          prop: "registerIp",
          label: "注册IP",
          // width: '180',
          align: "center"
        },
        {
          prop: "lastLoginDatetime",
          label: "最后登录时间",
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
      tableData: [
        {
          userNum: "13708718279",
          openId: "C000000002",
          nickName: "八戒导游",
          sex: "1",
          registerIp: "192.168.0.194",
          lastLoginTime: "2019-05-29 10:15:24",
          updateDate: "2019-05-29 10:15:24",
          status: 1
        }
      ],
      ruleForm2: {
        id: "",
        no: "",
        headUrl: "",
        frontFace: "",
        nickName: "",
        phone: "",
        email: "",
        sex: "",
        realName: "",
        credentialsNumber: "",
        registerIp: "",
        imei: "",
        createDatetime: "",
        updateDatetime: "",
        lastLoginDatetime: "",
        status: "",
        openId: "",
        needCount: "",
        orderPrice: "",
        orderCount: ""
      },
      tableTitle2: [
        {
          prop: "no",
          label: "需求编号",
          // width: '100',
          align: "center"
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
          // width: '100',
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          // width: '100',
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "提交时间",
          // width: '100',
          align: "center"
        },
        {
          prop: "type",
          label: "需求类型",
          // width: '100',
          align: "center"
        },
        {
          prop: "status",
          label: "需求状态",
          // width: '100',
          align: "center"
        },
        {
          prop: "buyStatus",
          label: "交易状态",
          // width: '100',
          align: "center"
        },
        {
          prop: "times",
          label: "下载次数",
          // width: '100',
          align: "center"
        }
      ],
      tableData2: []
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
          nickName: "",
          openId: "",
          startDatetime: "",
          endDatetime: "",
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

    getDefaultInfoFn2(n) {
      this.commonId = n;
      //此方法里面的第一个请求是获取用户详情信息
      this.$axios({
        method: "get",
        url: this.apiUserInfo + "?id=" + this.commonId,
        data: {}
      }).then(res => {
        // console.log("获取用户详情接口返回数据", res.data);
        if (res.data.resultStatus.resultCode === "0000") {
          this.ruleForm2 = res.data.value;
        } else {
          // this.$message.warning(res.data.resultStatus.resultMessage)
          this.$message.warning("获取数据失败");

          for (let item in this.ruleForm2) {
            this.ruleForm2[item] = "";
          }
        }
      });
      //此方法里面的第二个请求是获取用户需求明细表
      this.$axios({
        method: "post",
        url: this.apiQueryX,
        data: {
          pageNum: this.$store.state.pageNumParam2,
          pageSize: this.$store.state.pageSizeParam2,
          id: this.commonId
        }
      })
        .then(res => {
          // console.log("列表222信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData2 = [...res.data.value.list];
              this.$store.state.totalParam2 = res.data.value.total;
            } else {
              this.tableData2 = [];
              this.$store.state.totalParam2 = 0;
            }
            this.$store.state.userInfo = true;
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
          nickName: this.$store.state.nickNameParam,
          openId: this.$store.state.openIdParam,
          startDatetime: this.$store.state.startDateParam,
          endDatetime: this.$store.state.endDateParam,
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

    queryInfoFn2() {
      this.$axios({
        method: "post",
        url: this.apiQueryX,
        data: {
          pageNum: this.$store.state.pageNumParam2,
          pageSize: this.$store.state.pageSizeParam2,
          id: this.commonId
        }
      })
        .then(res => {
          // console.log("查询按钮或者翻页按钮信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData2 = [...res.data.value.list];
              this.$store.state.totalParam2 = res.data.value.total;
            } else {
              this.tableData2 = [];
              this.$store.state.totalParam2 = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //禁用，启用前先获取对应行数据的id
    chooseInfo(n) {
      this.commonId = n.id;
      this.userStatus = n.status;
    },

    //启用事件
    enabledFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.userStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此用户已被启用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiEnabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("启用之后的返回结果，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.commonId = "";
            // this.$store.state.pageNumParam = 1
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //禁用事件
    disabledFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.userStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此用户已被禁用，无需操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiDisabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("禁用之后返回的结果，", res.data);
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

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "ruleForm2") {
            this.$store.state.userInfo = false;
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.$store.state.userInfo = false;
    }
  }
};
</script>

<style scoped>
.user_info_box {
  border: 1px solid lightgrey;
  width: 100%;
  height: 6rem;
  min-width: 380px;
}
</style>
