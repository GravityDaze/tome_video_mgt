<template>
  <div>
    <mySearchs
      :sign="sign"
      :isAffiliatedScenery="isAffiliatedScenery"
      :isUserOpenId="isUserOpenId"
      :isUserNickName="isUserNickName"
      :isVideoNum="isVideoNum"
      :isOrderTime="isOrderTime"
      :isOrderState="isOrderState"
      :isPayState="isPayState"
      :changePayStateBtn="changePayStateBtn"
      :refundBtn="refundBtn"
      @changePayStateFn="changePayStateFn"
      @refundOrderFn="refundOrderFn"
      @queryInfoFn="queryInfoFn"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :sign="sign"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :isShowEnabled="isShowEnabled"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>

    <!--修改支付状态模态框-->
    <div id="publicAddEditorDialog">
      <el-dialog
        title="修改支付状态"
        :visible.sync="$store.state.orderManage"
        width="30%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm"
          :rules="payRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="支付状态为">
                <el-col>
                  <el-select v-model="ruleForm.payState" size="small" class="change_select_style">
                    <el-option
                      v-for="item in payStateArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="修改原因" prop="textarea">
                <el-col>
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model.trim="ruleForm.textarea"
                    maxlength="30"
                    show-word-limit
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

    <!--退款模态框-->
    <div id="sceneryAllInfo">
      <el-dialog
        title="退款"
        :visible.sync="$store.state.refundOrder"
        width="30%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm2"
          ref="ruleForm2"
          :rules="refundRules"
          label-width="100px"
          class="demo-ruleForm2"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="订单金额">
                <el-col>
                  <el-input v-model="ruleForm2.orderPrice" disabled></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="已退金额">
                <el-col>
                  <el-input v-model="ruleForm2.refundPrice" disabled></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="退款金额" prop="refundMoney">
                <el-col>
                  <el-input v-model="ruleForm2.refundMoney"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="退款原因" prop="textarea">
                <el-col>
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model.trim="ruleForm2.textarea"
                    maxlength="30"
                    show-word-limit
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <!--<el-col :span="4" :offset="2">-->
            <!--<el-button @click="resetForm('ruleForm2')">重置</el-button>-->
            <!--</el-col>-->
            <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm2')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "order-manage",
  data() {
    return {
      apiQuery: "/videomis/order/query",
      apiChangePayState: "/videomis/order/pay",
      apiReturnPrice1: "/videomis/order/refundPrice", //发起退款之前获取已退款的金额数据
      apiReturnPrice2: "/videomis/order/refund", //发起退款
      sign: "ordermanage",
      isAffiliatedScenery: true,
      isUserOpenId: true,
      isUserNickName: true,
      isVideoNum: true,
      isOrderTime: true,
      isOrderState: true,
      isPayState: true,
      changePayStateBtn: true,
      refundBtn: true,
      isShowEnabled: true,
      payStateArr: [
        {
          id: 9,
          name: "已支付",
          value: ""
        }
      ],
      ruleForm: {
        id: "",
        payState: "",
        textarea: ""
      },
      // 修改支付状态验证规则
      payRules: {
        textarea: [
          { required: true, message: "请输入修改原因", tigger: "blur" }
        ]
      },
      ruleForm2: {
        id: "",
        orderPrice: "",
        refundPrice: "",
        refundMoney: "",
        textarea: ""
      },
      // 退款验证规则
      refundRules: {
        refundMoney: [
          { required: true, message: "请输入退款金额", trigger: "blur" }
        ],
        textarea: [
          { required: true, message: "请输入退款原因", tigger: "blur" }
        ]
      },
      tableTitle: [
        {
          prop: "no",
          label: "订单编号",
          // width: '100',
          align: "center"
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
          // width: '180',
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          // width: '180',
          align: "center"
        },
        {
          prop: "customerNo",
          label: "用户编号",
          // width: '100',
          align: "center"
        },
        {
          prop: "customerOpenId",
          label: "用户OpenId",
          // width: '180',
          align: "center"
        },
        {
          prop: "videoNo",
          label: "小视频编号",
          // width: '180',
          align: "center"
        },
        {
          prop: "price",
          label: "订单金额",
          // width: '100',
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "下单时间",
          // width: '180',
          align: "center"
        },
        {
          prop: "status",
          label: "订单状态",
          // width: '180',
          align: "center",
          formatter: function(row) {
            if (row.status == "0") {
              return "未支付";
            } else if (row.status == "1") {
              return "已完成";
            } else if (row.status == "2") {
              return "关闭";
            }
          }
        },
        {
          prop: "buyDatetime",
          label: "支付时间",
          // width: '100',
          align: "center"
        },
        {
          prop: "payStatus",
          label: "支付状态",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.payStatus == "0" ? "未支付" : "已支付";
          }
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          // width: '180',
          align: "center"
        }
      ],
      tableData: [
        // {
        //   orderNum: '513322199706246636',
        //   sceneryNum: 'C000000002',
        //   afilicityScenery: '花果山',
        //   userNum: '13708718279',
        //   openId: 'O11111',
        //   videoNum: 'VQ1234',
        //   orderPrice: '158.00',
        //   orderTime: '2019-05-29 10:15:24',
        //   orderState: '未支付',
        //   payTime: '2019-05-29 10:15:24',
        //   payState: '未支付',
        //   updateDate: '2019-05-29 10:15:24',
        // },
      ]
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfoFn();
  },
  methods: {
    //默认获取查询数据
    getDefaultInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          sceneryName: "",
          customerNickName: "",
          customerOpenId: "",
          videoNo: "",
          createStartDatetime: "",
          createEndDatetime: "",
          status: "",
          payStatus: "",
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam
        }
      }).then(res => {
        // console.log("获取默认数据结果", res.data);
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
      });
    },

    queryInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          sceneryName: this.$store.state.affiliatedSceneryParam,
          customerNickName: this.$store.state.nickNameParam,
          customerOpenId: this.$store.state.openIdParam,
          videoNo: this.$store.state.videoNoParam,
          createStartDatetime: this.$store.state.startDateParam,
          createEndDatetime: this.$store.state.endDateParam,
          status: this.$store.state.orderStateParam,
          payStatus: this.$store.state.payStateParam,
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam
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

    //修改支付状态前，先获取需要修改数据的对应id
    chooseInfo(n) {
      // console.log("nnnnn", n);
      this.ruleForm.id = n.id;
      this.ruleForm2.id = n.id;
      this.ruleForm2.orderPrice = n.price;
    },

    //点击修改支付状态时，弹出修改模态框事件
    changePayStateFn() {
      if (this.ruleForm.id == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$store.state.orderManage = true;
      }
    },
    //修改支付状态后，开始提交更改信息事件
    submitChangeFn() {
      this.$axios({
        method: "post",
        url: this.apiChangePayState,
        data: {
          id: this.ruleForm.id,
          cause: this.ruleForm.textarea
        }
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.orderManage = false;
          // this.$store.state.pageNumParam = 1
          this.ruleForm.id == "";
          this.getDefaultInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    //退款前先获取是否有已退款的数据，事件
    refundOrderFn() {
      if (this.ruleForm.id == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiReturnPrice1 + "?id=" + this.ruleForm.id,
          data: {}
        }).then(res => {
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm2.refundPrice = res.data.value.refundPrice;
            this.ruleForm2.refundMoney = "";
            this.ruleForm2.textarea = "";
            this.$store.state.refundOrder = true;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //退款最终提交，事件
    sureRefundFn() {
      if (isNaN(Number(this.ruleForm2.refundMoney))) {
        this.$message.warning("请输入正确的金额");
      } else {
        var orderPrice = Number(this.ruleForm2.orderPrice.substring(1) * 100);
        var refundPrice = Number(this.ruleForm2.refundPrice.substring(1) * 100);
        var refundMoney = Number(this.ruleForm2.refundMoney * 100);
        if (refundMoney > orderPrice - refundPrice) {
          this.$message.warning("退款金额超出最大可退金额，无法进行退款");
        } else {
          this.$axios({
            method: "post",
            url: this.apiReturnPrice2,
            data: {
              id: this.ruleForm2.id,
              refundPrice: Number(this.ruleForm2.refundMoney * 100),
              cause: this.ruleForm2.textarea
            }
          }).then(res => {
            // console.log("确认提交退款信息返回结果", res.data);
            if (res.data.resultStatus.resultCode === "0000") {
              this.$store.state.refundOrder = false;
              this.ruleForm.id == "";
              // this.$store.state.pageNumParam = 1
              this.getDefaultInfoFn();
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
            }
          });
        }
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "ruleForm") {
            this.$confirm("确定修改此订单的支付状态为“已支付”?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                // alert('确定执行');

                this.submitChangeFn();
              })
              .catch(() => {
                this.$message.warning("本次操作已取消");
              });
          } else if (formName === "ruleForm2") {
            this.$confirm("确定进行退款操作吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                // alert('确定执行');
                this.sureRefundFn();
              })
              .catch(() => {
                this.$message.warning("本次操作已取消");
              });
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
        this.$store.state.orderManage = false;
      } else if (formName === "ruleForm2") {
        this.$store.state.refundOrder = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
