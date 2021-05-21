<template>
  <el-card>
    <ProTable
      v-loading="tablesLoading"
      :tableData="tableData"
      :tableCols="tableCols"
      :formData="formData"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />
    <el-dialog width="70%" title="订单明细"  :visible.sync="orderDiaglog">
      <ProTable
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
import {
  queryOrderSettlement,
  queryOrderDetail
} from "@/api/management/saleManage";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
  data() {
    return {
      tableCols: [
        {
          prop: "id",
          label: "结算ID",
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
        },
        {
          prop: "sceneryName",
          label: "所属景区",
        },
        {
          prop: "type",
          label: "结算周期",
        },
        {
          prop: "year",
          label: "结算年份",
        },
        {
          prop: "month",
          label: "结算月份",
        },
        {
          prop: "orderTotalPrice",
          label: "订单总金额",
        },
        {
          prop: "createDatetime",
          label: "生成时间",
        },
        {
          prop: "orderTotalNum",
          label: "订单总笔数",
        },
        {
          type: "button",
          label: "操作",
          width: "80",
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
          type: "yearPicker",
          label: "结算年份",
          model: "year"
        },
        {
          type: "monthPicker",
          label: "结算月份",
          model: "month"
        },
         {
          type: "button",
          btnType:"primary",
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
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
        },
        {
          prop: "sceneryName",
          label: "所属景区",
        },
        {
          prop: "customerNo",
          label: "用户编号",
        },
        {
          prop: "customerOpenId",
          label: "用户openId",
        },
        {
          prop: "videoId",
          label: "小视频ID",
        },
        {
          prop: "videoDuration",
          label: "小视频时长",
        },
        {
          prop: "orderPrice",
          label: "订单金额",
        },
        {
          prop: "orderCreateDatetime",
          label: "下单时间",
        },
        {
          prop: "orderPayStatus",
          label: "订单状态",
          formatter: row => (row.orderPayStatus == "0" ? "未支付" : "已支付")
        },
        {
          prop: "orderBuyDatetime",
          label: "支付时间",
        }
      ],
      orderDetailData: [],
      orderPagination: {
        total: 0,
        num: 1,
        size: 5
      },
      tablesLoading: false
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
        ...this.searchData
      }
    ) {
      this.tablesLoading = true;
      try {
        const { data } = await queryOrderSettlement(query);
        this.tableData = data.value.list;
        this.pagination.total = data.value.total;
      } finally {
        this.tablesLoading = false;
      }
    },

    // 打开订单详情对话框
    checkOrder({ id }) {
      this.orderDiaglog = true;
      this.id = id;
      this.getOrderDetail();
    },

    // 获取订单详情数据
    async getOrderDetail(
      query = {
        id: this.id,
        pageNum: this.orderPagination.num,
        pageSize: this.orderPagination.size
      }
    ) {
      const { data } = await queryOrderDetail(query);
      this.orderDetailData = data.value.list;
    },

    // 按钮查询
    query(searchData) {
       // 深度对比
      if (!_.isEqual(searchData, this.searchData)) {
        this.pagination.num = 1;
      }
      this.searchData = { ...searchData};
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
