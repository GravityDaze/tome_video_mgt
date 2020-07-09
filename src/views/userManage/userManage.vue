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

    <!-- 用户信息对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="用户信息"
      :visible.sync="customerDialog"
      append-to-body
      top="1%"
      width="70%"
      @close="dialogClose"
    >
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="first" label="用户详情">
          12154内容
        </el-tab-pane>
        <el-tab-pane name="second" label="需求明细">
          <tables
            :tableData="demandData"
            :tableCols="demandCols"
            :pagination="demandPagination"
            @sizeChange="demandSizeChange"
            @numChange="demandNumChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryCustomer,
  enableCustomer,
  disableCustomer,
  queryCustomerInfo,
  queryCustomerDemand
} from "@/api/management/customerManage";
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      tableCols: [
        {
          prop: "no",
          label: "用户编号",
          align: "center"
        },
        {
          prop: "nickName",
          label: "昵称",
          align: "center"
        },
        {
          prop: "sex",
          label: "性别",
          align: "center"
        },
        {
          prop: "registerIp",
          label: "注册IP",
          align: "center"
        },
        {
          prop: "lastLoginDatetime",
          label: "最后登录时间",
          align: "center"
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          align: "center"
        },
        {
          prop: "status",
          label: "状态",
          align: "center",
          type: "switch",
          change: this.handleStatus
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
              handle: this.checkCustomer
            }
          ]
        }
      ],
      formData: [
        {
          type: "input",
          label: "用户昵称",
          model: "nickName",
          placeholder: "请输入用户昵称"
        },
        {
          type: "datePicker",
          label: "注册时间",
          model: "createDatetime"
        },
        {
          type: "select",
          label: "状态",
          model: "status",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "禁用",
              value: 0
            },
            {
              label: "启用",
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
      ],
      customerDialog: false, //用户信息对话框
      demandData:[],
      demandCols:[
       {
          prop: "no",
          label: "需求编号",
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
          prop: "createDatetime",
          label: "提交时间",
          align: "center"
        },
        {
          prop: "type",
          label: "需求类型",
          align: "center"
        },
        {
          prop: "status",
          label: "需求状态",
          align: "center"
        },
        {
          prop: "buyStatus",
          label: "交易状态",
          align: "center"
        },
        {
          prop: "times",
          label: "下载次数",
          align: "center"
        },
      ],
      demandPagination:{
        num:1,
        size:5,
        total:0
      },
      activeName:'first'

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
      const { data } = await queryCustomer(query);
      this.tableData = data.value.list.map(v => {
        // 将0和1转换为布尔值
        v.status = !!v.status;
        return v;
      });
      this.pagination.total = data.value.total;
    },

    // 启用 & 禁用用户
    async handleStatus(row) {
      try {
        if (row.status) {
          await enableCustomer({ id: row.id });
          this.$message.success(`已启用用户：${row.nickName}`);
        } else {
          await disableCustomer({ id: row.id });
          this.$message.info(`已禁用用户：${row.nickName}`);
        }
      } catch (err) {
        // 错误时还原switch组件的状态
        row.status = !row.status;
      }
    },

    // 打开对话框
    checkCustomer({id}) {
      this.id = id
      this.customerDialog = true;
      this.getCustomerInfo()
      this.getDemandData()
    },


    // 对话框打开时默认查询用户详情
    async getCustomerInfo(){
      const { data } = await queryCustomerInfo( {id:this.id} )
    },


    // 查看用户需求明细数据
    async getDemandData(query={
      id:this.id,
      pageNum:this.demandPagination.num,
      pageSize:this.demandPagination.size
    }){
      const { data } = await queryCustomerDemand( query )
      this.demandPagination.total = data.value.total
      this.demandData = data.value.list
    },


    // 需求详情分页
    demandSizeChange(val){
      this.demandPagination.size = val
    },

    demandNumChange(val){
      this.demandPagination.num = val
    },


    // 对话框关闭
    dialogClose() {
      this.activeName = 'first'
    },

    // 按钮查询
    query(searchForm) {
      if (_.isEmpty(searchForm)) return this.$message.warning("无效的查询");

      // 查询时 pageNum必须恢复为1
      this.searchForm = searchForm;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    }
  }
};
</script>

<style>
</style>