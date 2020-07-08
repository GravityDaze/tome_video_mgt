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
  </el-card>
</template>

<script>
import {
  orderQuery,
  changeOrderStatus,
  refundPrice,
  refund
} from "@/api/saleManage";
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      tableCols: [
        {
          label: "订单编号",
          prop:"no",
          align:"center"
        },
        {
          label: "景区编号",
          prop:"sceneryNo",
          align:"center"
        },
        {
          label: "所属景区",
          prop:"sceneryName",
          align:"center"
        },
        {
          label: "用户编号",
          prop:"no",
          align:"center"
        },
        {
          label: "小视频编号",
          prop:"videoNo",
          align:"center"
        },
        {
          label: "订单金额",
          prop:"price",
          align:"center"
        },
        {
          label: "下单时间",
          prop:"createDatetime",
          align:"center"
        },
        {
          label: "订单状态",
          prop:"status",
          align:"center",
          formatter:row => row.status === 0 ? '未支付':'已完成'
        },
        {
          label:"支付时间",
          prop:"buyDatetime",
          align:"center"
        },
        {
          label:"支付状态",
          prop:"payStatus",
          align:"center",
          formatter:row => row.payStatus === 0 ? '未支付':'已支付'
        },
        {
          label:"操作",
          type:"button",
          btnList:[
            {
              type:'text',
              label:'修改支付状态',
              handle:this.changeStatus,
              showRule:row => row.payStatus === 0
            },
            {
              type:'primary',
              label:'退款',
              showRule:row => row.payStatus === 1
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
          type: "input",
          label: "昵称",
          model: "customerNickName",
          placeholder: "请输入用户昵称"
        },
        {
          type: "input",
          label: "小视频编号",
          model: "videoNo",
          placeholder: "请输入用户昵称"
        },
        {
          label: "下单时间",
          type: "datePicker",
          model: "createDatetime"
        },
        {
          label: "订单状态",
          type: "select",
          model: "status",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "未支付",
              value: 0
            },
            {
              label: "已完成",
              value: 1
            }
          ]
        },
        {
          type: "select",
          label: "支付状态",
          model: "payStatus",

          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "未支付",
              value: 0
            },
            {
              label: "已支付",
              value: 1
            }
          ]
        }
      ],
      searchBtn: [
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ]
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
      const { data } = await orderQuery(query);
      console.log(data.value.list)

      this.tableData = data.value.list
      this.pagination.total = data.value.total
    },


    // 修改支付状态
    changeStatus(row){

    },

    // 退款
    handleRefund(row){

    },

    // 查询
    query(searchForm){
      console.log(searchForm)
    }

  }
};
</script>

<style>
</style>