<template>
  <el-card>
    <searchs @query="query" :formData="formData" :searchBtn="searchBtn" />
    <tables
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />
    <el-dialog width="70%" title="订单明细" :visible.sync="orderDiaglog">
      <tables
        :tableData="orderDetailData"
        :tableCols="orderDetailCols"
        :pagination="orderPagination"
        @sizeChange="orderSizeChange"
        @numChange="ordernumChange"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import { queryOrderSettlement, queryOrderDetail } from "@/api/management/saleManage";
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      tableCols: [
        {
          prop: "id",
          label: "结算ID",
          align: "center"
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          align: "center"
        },
        {
          prop: "type",
          label: "结算周期",
          align: "center"
        },
        {
          prop: "year",
          label: "结算年份",
          align: "center"
        },
        {
          prop: "month",
          label: "结算月份",
          align: "center"
        },
        {
          prop: "orderTotalPrice",
          label: "订单总金额",
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "生成时间",
          align: "center"
        },
        {
          prop: "orderTotalNum",
          label: "订单总笔数",
          align: "center"
        },
        {
          type: "button",
          label: "操作",
          width: "80",
          align: "center",
          btnList: [
            {
              type: "primary",
              label: "查看",
              handle: this.checkOrder
            }
          ]
        }
      ],
      formData: [
        {
          type: "input",
          label: "所属景区",
          model: "sceneryName",
          placeholder: "请输入景区名称"
        },
        {
          type:"yearPicker",
          label:"结算年份",
          model: "year",
        },
        {
          type:"monthPicker",
          label:"结算月份",
          model:"month"
        }
      ],
      searchBtn: [
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ],
      orderDiaglog: false,
      orderDetailCols: [
        {
          prop: "orderNo",
          label: "订单编号",
          align: "center"
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          align: "center"
        },
        {
          prop: "customerNo",
          label: "用户编号",
          align: "center"
        },
        {
          prop: "customerOpenId",
          label: "用户openId",
          align: "center"
        },
        {
          prop: "videoId",
          label: "小视频ID",
          align: "center"
        },
        {
          prop: "videoDuration",
          label: "小视频时长",
          align: "center"
        },
        {
          prop: "orderPrice",
          label: "订单金额",
          align: "center"
        },
        {
          prop: "orderCreateDatetime",
          label: "下单时间",
          align: "center"
        },
        {
          prop: "orderPayStatus",
          label: "订单状态",
          align: "center",
          formatter: row => (row.orderPayStatus == "0" ? "未支付" : "已支付")
        },
        {
          prop: "orderBuyDatetime",
          label: "支付时间",
          align: "center"
        }
      ],
      orderDetailData: [],
      orderPagination: {
        total: 0,
        num: 1,
        size: 5
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData(
      query = {
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
        ...this.searchForm
      }
    ) {
      const { data } = await queryOrderSettlement(query);
      this.tableData = data.value.list;
      this.pagination.total = data.value.total;
    },

    // 打开订单详情对话框
    checkOrder({ id }) {
      this.orderDiaglog = true;
      this.id = id;
      this.getOrderDetail();
    },

    // 获取订单详情数据
    async getOrderDetail(query={
      id:this.id,
      pageNum:this.orderPagination.num,
      pageSize:this.orderPagination.size
    }) {
      const { data } = await queryOrderDetail(query);
      this.orderDetailData = data.value.list
    },

    // 按钮查询
    query(searchForm) {
      if (_.isEmpty(searchForm)) return this.$message.warning("无效的查询");
      
      // 查询时 pageNum必须恢复为1
      this.searchForm = searchForm;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    },

    // 订单详情分页
    ordernumChange(val) {
      this.orderPagination.num = val;
      this.getOrderDetail();
    },

    orderSizeChange(val) {
      this.orderPagination.size = val;
      this.getOrderDetail();
    }
  }
};
</script>

<style scoped>
</style>
