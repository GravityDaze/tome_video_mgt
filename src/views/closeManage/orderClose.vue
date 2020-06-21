<template>
  <div>
    <mySearchs
      :isAffiliatedScenery="isAffiliatedScenery"
      :isCloseYear="isCloseYear"
      :isCloseMonth="isCloseMonth"
      @queryInfoFn="queryInfoFn"
    ></mySearchs>
    <myTables
      :tableTitle="tableTitle"
      :tableData="tableData"
      :isShowEnabled="isShowEnabled"
      :isShowOrderCount="isShowOrderCount"
      @queryInfoFn="queryInfoFn"
      @getDefaultInfoFn2="getDefaultInfoFn2"
    ></myTables>

    <div id="myTablesDialog">
      <el-dialog
        :title="'订单明细--'+$store.state.orderInfoTitle"
        :visible.sync="$store.state.orderInfo"
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
            <!-- <mySearchs></mySearchs> -->
            <myTables
              :tableTitle="tableTitle2"
              :tableData="tableData2"
              :isShowEnabled="isShowEnabled"
              :showPagePlug1="showPagePlug1"
              @queryInfoFn2="queryInfoFn2"
            ></myTables>
          </div>
          <el-form-item>
            <el-col :span="6" :offset="18" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm2')">关闭</el-button>
              <!--<el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>-->
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "order-close",
  data() {
    return {
      apiQuery: "/videomis/orderCount/query",
      apiQueryX: "/videomis/orderCount/detail",
      sign: "orderclose",
      isAffiliatedScenery: true,
      isCloseYear: true,
      isCloseMonth: true,
      isShowEnabled: true,
      isShowOrderCount: true,
      showPagePlug1: true,
      commonId: "", //查询第二列表数据需要的id
      tableTitle: [
        {
          prop: "id",
          label: "结算ID",
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
          prop: "type",
          label: "结算周期",
          // width: '100',
          align: "center"
        },
        {
          prop: "year",
          label: "结算年份",
          // width: '180',
          align: "center"
        },
        {
          prop: "month",
          label: "结算月份",
          // width: '180',
          align: "center"
        },
        {
          prop: "orderTotalPrice",
          label: "订单总金额",
          // width: '100',
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "生成时间",
          // width: '180',
          align: "center"
        }
        // {
        //   prop: 'orderCount',
        //   label: '订单总笔数',
        //   // width: '180',
        //   align: 'center'
        // },
      ],
      tableData: [
        {
          closeId: "00001",
          sceneryNum: "S000000002",
          afilicityScenery: "火锅山",
          closeCycle: "月",
          closeYear: "2020",
          closeMonth: "11",
          orderAllMoney: "9800.00",
          creatTime: "2019-05-29 10:15:24",
          orderCount: "39"
        }
      ],
      ruleForm2: {
        name: "",
        need: "",
        iconUrl: "../../static/addIcon.png",
        iconUrl2: []
      },
      tableTitle2: [
        {
          prop: "orderNo",
          label: "订单编号",
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
          prop: "customerNo",
          label: "用户编号",
          // width: '100',
          align: "center"
        },
        {
          prop: "customerOpenId",
          label: "用户openId",
          // width: '100',
          align: "center"
        },
        {
          prop: "videoId",
          label: "小视频ID",
          // width: '100',
          align: "center"
        },
        {
          prop: "videoDuration",
          label: "小视频时长",
          // width: '100',
          align: "center"
        },
        {
          prop: "orderPrice",
          label: "订单金额",
          // width: '100',
          align: "center"
        },
        {
          prop: "orderCreateDatetime",
          label: "下单时间",
          // width: '100',
          align: "center"
        },
        {
          prop: "orderPayStatus",
          label: "订单状态",
          // width: '100',
          align: "center",
          formatter: function(row) {
            return row.orderPayStatus == "0" ? "未支付" : "已支付";
          }
        },
        {
          prop: "orderBuyDatetime",
          label: "支付时间",
          // width: '100',
          align: "center"
        }
      ],
      tableData2: [
        {
          orderNum: "n00214",
          sceneryNum: "s000000002",
          afilicityScenery: "大雁塔",
          userNum: "n00214",
          openId: "O1111",
          videoId: "V00214",
          videoTime: "30s",
          orderMoney: "99.00",
          orderTime: "2019-10-12 15:30:29",
          orderState: "未支付",
          payTime: "2019-10-12 15:30:29"
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
          sceneryName: "",
          year: "",
          month: ""
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
            this.$store.state.orderInfo = true;
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
          sceneryName: this.$store.state.affiliatedSceneryParam,
          year: this.$store.state.yearParam,
          month: this.$store.state.monthParam
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

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "ruleForm2") {
            this.$store.state.orderInfo = false;
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm(formName) {
      if (formName === "ruleForm2") {
        this.$refs[formName].resetFields();
        this.$store.state.orderInfo = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
